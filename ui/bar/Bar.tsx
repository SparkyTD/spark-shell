import {App, Astal, Gdk} from "astal/gtk4"

import TimeWidget from "./widgets/time/TimeWidget";
import TitleWidget from "./widgets/title/TitleWidget";
import TrayWidget from "./widgets/tray/TrayWidget";
import AudioWidget from "./widgets/audio/AudioWidget";
import OpenVPNWidget from "./widgets/openvpn/OpenVPNWidget";
import WorkspacesWidget from "./widgets/workspaces/WorkspacesWidget";
import Separator from "./Separator";
import {exec} from "astal";
import {AppConfig} from "../../config";

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const {TOP, LEFT, RIGHT} = Astal.WindowAnchor
    console.log(gdkmonitor.get_model(), gdkmonitor.get_connector());

    //const drawerVisible = Variable(false);
    //SystemDrawer(gdkmonitor, drawerVisible());

    return <window
        visible={true}
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}
        namespace="astal-bar-gtk4"
        setup={self => {
            if (AppConfig.bar.enableHyprlandBlur) {
                exec(["hyprctl", "-r", "--", "keyword", "layerrule", `blur,${self.namespace}`]);
                exec(["hyprctl", "-r", "--", "keyword", "layerrule", "ignorealpha", `0.0,${self.namespace}`]);
            }
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