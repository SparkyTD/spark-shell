import {bind} from "astal";
import {Gtk} from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";

export default function WorkspacesWidget() {
    const hyprland = Hyprland.get_default();
    const monitorCount = hyprland.monitors.length;

    const height = 8;

    return <box cssClasses={["widget-workspaces"]}>
        {[...Array(Math.max(16)).keys()].map(id => {
            return <box heightRequest={height}
                        valign={Gtk.Align.CENTER}
                        cssClasses={bind(hyprland, 'focusedWorkspace')
                            .as(workspace => getDotClasses(workspace.id, monitorCount, id))}>
                <box widthRequest={height}>
                </box>
            </box>;
        })}
    </box>
}

function getDotClasses(workspaceId: number, monitorCount: number, index: number): string[] {
    const minimumCount = 4;
    const globalId = Math.floor(workspaceId / monitorCount);

    if (index > Math.max(minimumCount - 1, globalId))
        return [];

    if (index === globalId)
        return ["dot", "active"];
    else
        return ["dot"];
}