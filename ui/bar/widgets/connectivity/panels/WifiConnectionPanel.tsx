import {Gdk, Gtk} from "astal/gtk4";
import DeviceManager from "../device-manager";
import {Binding, GLib, Variable} from "astal";

type Params = {
    manager: DeviceManager,
    isOpen: Binding<boolean>,
};

export default function WifiConnectionPanel({manager, isOpen}: Params) {
    let isScanning = Variable(false);
    let scanInterval: GLib.Source;

    manager.resumeWifiUpdates();
    isOpen.subscribe(isOpen => {
        manager.resumeWifiUpdates();
        if (isOpen) {
            if (!!scanInterval) {
                clearInterval(scanInterval);
            }

            scanInterval = setInterval(() => {
                manager.scanWifiConnections();
            }, 2000);
        } else if (!!scanInterval) {
            clearInterval(scanInterval);
        }
    });

    return <box cssClasses={["wireless"]}>
        {manager.isWifiPresent().as(present => {
            if (present) {
                return <box cssClasses={["content"]} vertical>
                    <label cssClasses={["title"]} halign={Gtk.Align.START}>WiFi</label>
                    {manager.wifiAvailableConnections().as(connections => {
                        return connections.map(connection => {
                            let isPwInputOpen = Variable(false);
                            return <box vertical cssClasses={["connection-row"]}>
                                <box cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                     setup={self => {
                                         let controller = new Gtk.GestureClick();
                                         controller.connect('pressed', () => {
                                             if (manager.wifiActiveConnectionName.get() == connection.ssid) {
                                                 return;
                                             }

                                             let security = manager.getApSecurity(connection);
                                             if (security == "--") {
                                                 manager.connectToWifiAccessPoint(connection, '');
                                             } else {
                                                 isPwInputOpen.set(!isPwInputOpen.get());
                                                 if (isPwInputOpen.get()) {
                                                     manager.pauseWifiUpdates();
                                                 } else {
                                                     manager.resumeWifiUpdates();
                                                 }
                                             }
                                         });
                                         self.add_controller(controller);
                                     }}>
                                    <image iconName={connection.iconName}/>
                                    <label label={connection.ssid}
                                           cssClasses={manager.wifiActiveConnectionName().as(active =>
                                               active == connection.ssid ? ["active", "ssid"] : ["ssid"])}/>
                                    <box hexpand={true}/>
                                    <button halign={Gtk.Align.END}
                                            cssClasses={["button", "disconnect"]}
                                            visible={manager.wifiActiveConnectionName().as(active =>
                                                active == connection.ssid)}
                                            onClicked={() => {
                                                manager.disconnectFromWifi();
                                            }}>
                                        Disconnect
                                    </button>
                                </box>
                                <revealer revealChild={isPwInputOpen()}>
                                    <entry placeholderText="Enter password..." onActivate={self => {
                                        manager.connectToWifiAccessPoint(connection, self.text);
                                        isPwInputOpen.set(false);
                                        manager.resumeWifiUpdates();
                                    }}/>
                                </revealer>
                            </box>
                        })
                    })}
                    <label halign={Gtk.Align.START} visible={isScanning()}>Scanning...</label>
                </box>
            } else {
                return <box visible={false}></box>
            }
        })}
    </box>;
}