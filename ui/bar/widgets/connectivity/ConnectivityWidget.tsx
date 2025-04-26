import {Gdk} from "astal/gtk4";
import DeviceManager from "./device-manager";
import ConnectivityPopup from "./ConnectivityPopup";

export default function ConnectivityWidget() {
    const manager = new DeviceManager();

    return <menubutton cssClasses={["widget-connectivity", "bar-button"]}
                       cursor={Gdk.Cursor.new_from_name("pointer", null)}>
        <box>
            <image visible={manager.isWifiPresent()} iconName={manager.wifiIcon()}/>
            <image visible={manager.isWiredPresent()} iconName={manager.wiredIcon()}/>
            <image visible={manager.isBluetoothPresent()} iconName={manager.bluetoothIcon()}/>
        </box>

        <ConnectivityPopup manager={manager}/>
    </menubutton>
}

