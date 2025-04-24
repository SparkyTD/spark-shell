import {Variable, GLib, bind} from "astal"

export default function TimeWidget({format = "%a %b %d %I:%M %p"}) {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <label
        onDestroy={() => time.drop()}
        label={time()}
    />
}