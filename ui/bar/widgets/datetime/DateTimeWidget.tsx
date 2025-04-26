import {Variable, GLib} from "astal"
import {AppConfig} from "../../../../config";
import {Gdk} from "astal/gtk4";
import DateTimePopup from "./DataTimePopup";

export default function DateTimeWidget({format = AppConfig.bar.widgets.datetime.dateTimeFormat}) {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <menubutton cssClasses={["widget-datetime", "bar-button"]}
                       cursor={Gdk.Cursor.new_from_name("pointer", null)}>
        <label
            onDestroy={() => time.drop()}
            label={time()}/>

        <DateTimePopup/>
    </menubutton>
}