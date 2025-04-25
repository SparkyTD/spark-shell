import {Variable, GLib} from "astal";
import {Gtk} from "astal/gtk4";
import {AppConfig} from "../../../../config";
import Separator from "../../Separator";

export default function DateTimePopup() {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(AppConfig.bar.widgets.datetime.timeFormat)!)

    return <popover>
        <box widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <label cssClasses={["time-title"]}>
                {time()}
            </label>

            <Separator orientation={'horizontal'}/>

            <Gtk.Calendar/>
        </box>
    </popover>
}