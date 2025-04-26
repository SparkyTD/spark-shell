import {bind} from "astal";
import {Gdk, Gtk} from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";

function setupIconController(box: Gtk.Box, workspaceId: number, hyprland: Hyprland.Hyprland) {
    let clickController = new Gtk.GestureClick({button: 0});
    clickController.connect('pressed', () => {
        const virtualDesktopId = workspaceId + 1;
        hyprland.dispatch("vdesk", `${virtualDesktopId}`);
    });
    box.add_controller(clickController);
}

export default function WorkspacesWidget() {
    const hyprland = Hyprland.get_default();
    const monitorCount = hyprland.monitors.length;

    const height = 8;

    return <box cssClasses={["widget-workspaces"]}>
        {[...Array(Math.max(16)).keys()].map(id => {
            return <box heightRequest={height}
                        valign={Gtk.Align.CENTER}
                        cssClasses={bind(hyprland, 'focusedWorkspace')
                            .as(workspace => getDotClasses(workspace.id, monitorCount, id))}
                        visible={bind(hyprland, 'focusedWorkspace')
                            .as(workspace => getDotClasses(workspace.id, monitorCount, id).length > 0)}
                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                        setup={self => setupIconController(self, id, hyprland)}>
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