import {bind, GLib, Variable} from "astal";
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import NM from "gi://NM";

export default class DeviceManager {
    private network: Network.Network;
    private bluetooth: Bluetooth.Bluetooth;

    private wifi: Network.Wifi | null = null;

    public isWifiPresent: Variable<boolean>;
    public isWiredPresent: Variable<boolean>;
    public isBluetoothPresent: Variable<boolean>;

    public wifiIcon = Variable("network-wireless-offline-symbolic");
    public wiredIcon = Variable("network-wired-disconnected-symbolic");
    public bluetoothIcon = Variable("bluetooth-symbolic");

    public wifiActiveConnectionName: Variable<string | null> = Variable(null);
    public wifiAvailableConnections: Variable<Network.AccessPoint[]> = Variable([]);
    public wiredActiveConnectionSpeed: Variable<number> = Variable(0);
    public wiredConnectionState: Variable<Network.DeviceState> = Variable(Network.DeviceState.UNKNOWN);

    private processWifiUpdates = true;

    constructor() {
        this.network = Network.get_default();
        this.isWifiPresent = Variable(!!this.network.wifi);
        this.isWiredPresent = Variable(!!this.network.wired);
        this.network.client.connect('device-added', () => DeviceManager.updateNetworkStatus(this));
        this.network.client.connect('device-removed', () => DeviceManager.updateNetworkStatus(this));
        this.network.client.connect('active-connection-added', () => DeviceManager.updateNetworkStatus(this));
        this.network.client.connect('active-connection-removed', () => DeviceManager.updateNetworkStatus(this));
        DeviceManager.updateNetworkStatus(this);

        this.bluetooth = Bluetooth.get_default();
        this.isBluetoothPresent = Variable(!!this.bluetooth.adapter);
        this.bluetooth.connect('adapter-added', () => DeviceManager.updateBluetoothStatus(this));
        this.bluetooth.connect('adapter-removed', () => DeviceManager.updateBluetoothStatus(this));
        DeviceManager.updateBluetoothStatus(this)
    }

    static updateNetworkStatus(self: DeviceManager): void {
        self.network = new Network.Network();
        self.isWifiPresent.set(self.network.client.devices
            .some(d => d.deviceType == NM.DeviceType.WIFI));
        self.isWiredPresent.set(self.network.client.devices
            .some(d => d.deviceType == NM.DeviceType.ETHERNET));

        if (!!self.network.wifi) {
            self.updateWifiVariables(self.network.wifi);
            bind(self.network.wifi, 'iconName').subscribe(() => {
                self.updateWifiVariables(self.network.wifi);
            });
        }

        if (!!self.network.wired) {
            self.updateWiredVariables(self.network.wired);
            bind(self.network.wired, 'iconName').subscribe(() => {
                self.updateWiredVariables(self.network.wired);
            });
        }
    }

    public pauseWifiUpdates() {
        this.processWifiUpdates = false;
    }

    public resumeWifiUpdates() {
        this.processWifiUpdates = true;
    }

    updateWifiVariables(wifi: Network.Wifi | null) {
        if (!this.processWifiUpdates) {
            return;
        }

        this.wifi = wifi;

        if (!wifi) {
            this.wifiIcon.set("network-wireless-offline-symbolic");
            this.wifiActiveConnectionName.set(null);
            return;
        }

        this.wifiIcon.set(getWifiIcon(wifi));
        this.wifiActiveConnectionName.set(wifi.ssid);
        this.wifiAvailableConnections.set(wifi.accessPoints);
        bind(wifi, 'activeConnection').subscribe(() => {
            this.wifiActiveConnectionName.set(wifi.ssid);
            this.wifiAvailableConnections.set(wifi.accessPoints);
        })

        function getWifiIcon(wifi: Network.Wifi) {
            if (!wifi.enabled) {
                return "network-wireless-disabled-symbolic";
            }

            if (!wifi.activeConnection) {
                return "network-wireless-offline-symbolic";
            }

            return wifi.iconName;
        }
    }

    updateWiredVariables(wired: Network.Wired | null) {
        if (!wired) {
            this.wiredIcon.set("network-wired-disconnected-symbolic");
            this.wiredActiveConnectionSpeed.set(0);
            this.wiredConnectionState.set(Network.DeviceState.UNKNOWN);
            return;
        }

        this.wiredActiveConnectionSpeed.set(wired.speed)
        this.wiredConnectionState.set(wired.state);
        bind(wired, 'state').subscribe(() => {
            this.wiredActiveConnectionSpeed.set(wired.speed);
            this.wiredConnectionState.set(wired.state);
        })

        this.wiredIcon.set(wired.iconName);
    }

    public scanWifiConnections() {
        if (!this.wifi) {
            return;
        }

        this.updateWifiVariables(this.wifi);
        this.wifi.scan();
    }

    public connectToWifiAccessPoint(accessPoint: Network.AccessPoint, password: string) {
        if (!this.wifi) {
            return;
        }

        let wifiAccessPoint = this.network.wifi.device.get_access_points()
            .find(a => new TextDecoder().decode(a.ssid.toArray()) == accessPoint.ssid);
        if (wifiAccessPoint == null) {
            console.log("Failed to match the access point!");
            return;
        }

        let security = this.getApSecurity(accessPoint);

        let profile = new NM.SimpleConnection();

        let connectionSettings = new NM.SettingConnection();
        connectionSettings.id = accessPoint.ssid;
        connectionSettings.uuid = GLib.uuid_string_random();
        connectionSettings.type = '802-11-wireless';
        profile.add_setting(connectionSettings);

        let wirelessSettings = new NM.SettingWireless();
        wirelessSettings.ssid = wirelessSettings.ssid;
        wirelessSettings.mode = 'infrastructure';
        wirelessSettings.macAddress = this.wifi.device.get_permanent_hw_address();
        profile.add_setting(wirelessSettings);

        let ipv4Settings = new NM.SettingIP4Config();
        ipv4Settings.method = 'auto';
        profile.add_setting(ipv4Settings);

        let ipv6Settings = new NM.SettingIP6Config();
        ipv6Settings.method = 'auto';
        profile.add_setting(ipv6Settings);

        if (security != "--") {
            let securitySettings = new NM.SettingWirelessSecurity();
            if (security.includes("WPA")) {
                if (security.includes("WPA3")) {
                    securitySettings.keyMgmt = "sae";
                } else {
                    securitySettings.keyMgmt = "wpa-psk";
                }
                securitySettings.authAlg = "open";
                securitySettings.psk = password;
            } else if (security.includes("WEP")) {
                securitySettings.keyMgmt = "None";
                securitySettings.wepKeyType = NM.WepKeyType.PASSPHRASE;
                securitySettings.wep_key0 = password;
            }
            profile.add_setting(securitySettings);
        }

        console.log("Connecting to", wifiAccessPoint!.path, this.getApSecurity(accessPoint));
        this.network.client.add_and_activate_connection_async(
            profile, this.wifi.device, wifiAccessPoint!.path, null, (client, result) => {
                let activeConnection = client?.add_and_activate_connection_finish(result);
                console.log("Callback", activeConnection?.state);
            });
    }

    public disconnectFromWifi() {
        let connection = this.network.wifi.activeConnection;
        if (!connection) {
            return;
        }

        this.network.client.deactivate_connection(connection, null);
    }

    public getApSecurity(accessPoint: Network.AccessPoint): string {
        let flags = accessPoint.flags;
        let wpaFlags = accessPoint.wpaFlags;
        let rsnFlags = accessPoint.rsnFlags;
        let securityString: string = "";

        if ((flags & __80211ApFlags.PRIVACY) && wpaFlags == 0 && rsnFlags == 0) {
            securityString = " WEP";
        }

        if (wpaFlags != 0) {
            securityString = " WPA1";
        }
        if (rsnFlags & __80211ApSecurityFlags.KEY_MGMT_PSK) {
            securityString += " WPA2";
        }
        if (rsnFlags & __80211ApSecurityFlags.KEY_MGMT_SAE) {
            securityString += " WPA3";
        }
        if ((wpaFlags & __80211ApSecurityFlags.KEY_MGMT_802_1X) ||
            (rsnFlags & __80211ApSecurityFlags.KEY_MGMT_802_1X)) {
            securityString += " 802.1X";
        }
        if ((wpaFlags & __80211ApSecurityFlags.KEY_MGMT_OWE) ||
            (rsnFlags & __80211ApSecurityFlags.KEY_MGMT_OWE)) {
            securityString += " OWE";
        }

        if (securityString == "") {
            securityString = "--";
        }

        return securityString.trimStart();
    }

    static updateBluetoothStatus(self: DeviceManager): void {
        self.bluetooth = new Bluetooth.Bluetooth();
        self.isBluetoothPresent.set(!!self.bluetooth.adapter);
    }
}

enum __80211ApFlags {
    /**
     * access point has no special capabilities
     */
    NONE = 0,
    /**
     * access point requires authentication and
     * encryption (usually means WEP)
     */
    PRIVACY = 1,
    /**
     * access point supports some WPS method
     */
    WPS = 2,
    /**
     * access point supports push-button WPS
     */
    WPS_PBC = 4,
    /**
     * access point supports PIN-based WPS
     */
    WPS_PIN = 8,
}

enum __80211ApSecurityFlags {
    /**
     * the access point has no special security requirements
     */
    NONE = 0,
    /**
     * 40/64-bit WEP is supported for
     * pairwise/unicast encryption
     */
    PAIR_WEP40 = 1,
    /**
     * 104/128-bit WEP is supported for
     * pairwise/unicast encryption
     */
    PAIR_WEP104 = 2,
    /**
     * TKIP is supported for pairwise/unicast encryption
     */
    PAIR_TKIP = 4,
    /**
     * AES/CCMP is supported for pairwise/unicast encryption
     */
    PAIR_CCMP = 8,
    /**
     * 40/64-bit WEP is supported for group/broadcast
     * encryption
     */
    GROUP_WEP40 = 16,
    /**
     * 104/128-bit WEP is supported for
     * group/broadcast encryption
     */
    GROUP_WEP104 = 32,
    /**
     * TKIP is supported for group/broadcast encryption
     */
    GROUP_TKIP = 64,
    /**
     * AES/CCMP is supported for group/broadcast
     * encryption
     */
    GROUP_CCMP = 128,
    /**
     * WPA/RSN Pre-Shared Key encryption is
     * supported
     */
    KEY_MGMT_PSK = 256,
    /**
     * 802.1x authentication and key management
     * is supported
     */
    KEY_MGMT_802_1X = 512,
    /**
     * WPA/RSN Simultaneous Authentication of Equals is
     * supported
     */
    KEY_MGMT_SAE = 1024,
    /**
     * WPA/RSN Opportunistic Wireless Encryption is
     * supported
     */
    KEY_MGMT_OWE = 2048,
    /**
     * WPA/RSN Opportunistic Wireless Encryption
     * transition mode is supported. Since: 1.26.
     */
    KEY_MGMT_OWE_TM = 4096,
    /**
     * WPA3 Enterprise Suite-B 192 bit mode
     * is supported. Since: 1.30.
     */
    KEY_MGMT_EAP_SUITE_B_192 = 8192,
}