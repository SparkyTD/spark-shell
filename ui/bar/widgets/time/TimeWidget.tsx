import {Variable, GLib} from "astal"
import {AppConfig} from "../../../../config";

export default function TimeWidget({format = AppConfig.bar.widgets.time.format}) {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <label
        onDestroy={() => time.drop()}
        label={time()}
    />
}