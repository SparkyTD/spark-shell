import {App, Astal, Gdk, Gtk} from "astal/gtk4"

import TimeWidget from "./widgets/time/TimeWidget";
import TitleWidget from "./widgets/title/TitleWidget";
import TrayWidget from "./widgets/tray/TrayWidget";
import AudioWidget from "./widgets/audio/AudioWidget";
import OpenVPNWidget from "./widgets/openvpn/OpenVPNWidget";
import WorkspacesWidget from "./widgets/workspaces/WorkspacesWidget";
import Separator from "./Separator";

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const {TOP, LEFT, RIGHT} = Astal.WindowAnchor

    //const drawerVisible = Variable(false);
    //SystemDrawer(gdkmonitor, drawerVisible());

    return <window
        visible={true}
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}
        setup={self => {
            //exec(["hyprctl", "-r", "--", "keyword", "layerrule", `blur,${self.namespace}`]);
            //exec(["hyprctl", "-r", "--", "keyword", "layerrule", "ignorealpha", `0.0,${self.namespace}`]);
        }}>

        <box cssClasses={["root"]}>
            <overlay>
                <box cssClasses={["bar-background"]} hexpand={true}/>
                <centerbox type="overlay measure" cssClasses={["content-wrapper"]} hexpand={true}>
                    <box>
                        <TimeWidget/>
                        <Separator/>
                        <WorkspacesWidget/>
                    </box>
                    <box>
                        <TitleWidget/>
                    </box>
                    <box>
                        <OpenVPNWidget/>
                        <Separator/>
                        <AudioWidget/>
                        <Separator/>
                        <TrayWidget/>
                    </box>
                </centerbox>
            </overlay>
        </box>
    </window>
}