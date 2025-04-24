import {Variable, GLib, bind} from "astal"
import Hyprland from "gi://AstalHyprland"

export default function TitleWidget() {
    const hypr = Hyprland.get_default()
    const focused = bind(hypr, "focusedClient")

    return <box
        visible={focused.as(Boolean)}>
        {focused.as(client => (
            client && <label label={bind(client, "title").as(String)}/>
        ))}
    </box>
}