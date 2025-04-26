import {Gtk} from "astal/gtk4";
import DeviceManager from "../device-manager";

type Params = {
    manager: DeviceManager,
};

export default function BluetoothConnectionPanel({manager}: Params) {
    return <box cssClasses={["bluetooth"]}>
        {manager.isBluetoothPresent().as(present => {
            if (present) {
                return <box vertical>
                    <label cssClasses={["title"]} halign={Gtk.Align.START}>Bluetooth</label>
                    <label halign={Gtk.Align.START}>Not connected</label>
                </box>
            } else {
                return <box visible={false}></box>
            }
        })}
    </box>;
}