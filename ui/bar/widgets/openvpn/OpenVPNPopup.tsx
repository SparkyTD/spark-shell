import {Gdk, Gtk} from "astal/gtk4";
import {Config, OpenVPNDaemonClient, Session} from "./daemon-client";
import {Binding, Variable} from "astal";

type Params = {
    activeSession?: Binding<Session | null>,
    allConfigs?: Binding<Config[]>,
    client: OpenVPNDaemonClient,
}

function ConnectionSelector({activeSession, allConfigs, client}: Params) {
    return <box orientation={Gtk.Orientation.VERTICAL}>
        {allConfigs?.as((endpoints) => {
            return endpoints.map((endpoint) => {
                return <centerbox cssClasses={["option-row"]}>
                    <label>{endpoint.name}</label>
                    <box></box>
                    <button cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            cssClasses={activeSession?.as(session => session?.config.guid == endpoint.guid
                                ? ["inactive"] : ["active"])}
                            onClicked={() => {
                                if (activeSession?.get()?.config.guid == endpoint.guid) {
                                    client.stopSession();
                                    return;
                                }

                                if (!!activeSession?.get())
                                    client.stopSession();
                                client.startSession(endpoint);
                            }}
                            widthRequest={100}>
                        {activeSession?.as(session => session?.config.guid == endpoint.guid
                            ? "Disconnect" : "Connect")}
                    </button>
                </centerbox>
            })
        })}
    </box>
}

export type PopupParams = {
    client: OpenVPNDaemonClient;
    availableConfigs: Variable<Config[]>
};

export default function OpenVPNPopup({client, availableConfigs}: PopupParams) {
    return <popover>
        <box widthRequest={200} orientation={Gtk.Orientation.VERTICAL}>
            <label cssClasses={["title"]} halign={Gtk.Align.START}>OpenVPN Connections</label>
            <ConnectionSelector
                client={client}
                allConfigs={availableConfigs()}
                activeSession={client.activeSession()}/>
        </box>
    </popover>
}