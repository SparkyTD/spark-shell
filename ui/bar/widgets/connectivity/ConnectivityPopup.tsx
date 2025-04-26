import {Gtk} from "astal/gtk4";
import Separator from "../../Separator";
import WiredConnectionPanel from "./panels/WiredConnectionPanel";
import WifiConnectionPanel from "./panels/WifiConnectionPanel";
import BluetoothConnectionPanel from "./panels/BluetoothConnectionPanel";
import DeviceManager from "./device-manager";
import {Variable} from "astal";

type Params = {
    manager: DeviceManager,
    isOpen?: Variable<boolean>,
};

export default function ConnectivityPopup({manager, isOpen = Variable(false)}: Params) {
    return <popover onShow={() => isOpen.set(true)} onClosed={() => isOpen.set(false)}>
        <box widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <WiredConnectionPanel manager={manager}/>
            <Separator orientation={'horizontal'}/>
            <WifiConnectionPanel manager={manager} isOpen={isOpen()}/>
            <Separator orientation={'horizontal'}/>
            <BluetoothConnectionPanel manager={manager}/>
        </box>
    </popover>
}