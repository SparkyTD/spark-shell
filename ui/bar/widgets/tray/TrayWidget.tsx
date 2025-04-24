import {Variable, GLib, bind} from "astal"
import Tray from "gi://AstalTray?version=0.1";

export default function TrayWidget () {
    const tray = Tray.get_default();

    const items = bind(tray, "items").as((items) =>
        items.map((item) => {
            return (
                <menubutton
                    tooltipMarkup={bind(item, "tooltipMarkup")}
                    setup={(self) => {
                        self.insert_action_group("dbusmenu", item.actionGroup);
                    }}
                    menuModel={bind(item, "menuModel")}>
                    <image gicon={bind(item, "gicon")} />
                </menubutton>
            );
        })
    );

    return <box cssClasses={["widget-tray"]}>{items}</box>;
}