import {Variable} from "astal"
import Hyprland from "gi://AstalHyprland";

export default function KeyboardLayoutWidget() {
    const hyprland = Hyprland.get_default();
    const layoutName = Variable("");

    hyprland.connect('keyboard-layout', (_, keyboard, lang) => {
        console.log(keyboard, lang);
        layoutName.set(lang);
    });

    return <label>{layoutName()}</label>
}