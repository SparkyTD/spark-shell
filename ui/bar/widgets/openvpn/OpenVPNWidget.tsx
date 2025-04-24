import {Gdk, Gtk} from "astal/gtk4";
import {Config, getClientInstance, OpenVPNDaemonClient, Session, Status} from "./daemon-client";
import {bind, Binding, Variable} from "astal";

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

export default function OpenVPNWidget() {
    let client = getClientInstance();
    client.connect();
    client.updateActiveSession();

    const getSessionName = (session: Session) => {
        if (!session)
            return "Disconnected";

        return session.config.name;
    }

    const getSessionIcon = (session: Session) => {
        if (!session || session.status === Status.Stopped) {
            return "mintupdate-error";
        } else if (session.status === Status.Running) {
            return "mintupdate-up-to-date";
        } else {
            return "mintupdate-checking";
        }
    };

    const availableConfigs: Variable<Config[]> = Variable([]);
    client.getConfigsCallback((_error, configs) => {
        availableConfigs.set(configs!);
    });

    return <menubutton cssClasses={["widget-openvpn"]} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <image iconName={client.activeSession().as(s => getSessionIcon(s!))}/>
            <label>{client.activeSession().as(s => getSessionName(s!))}</label>
        </box>

        <popover>
            <box widthRequest={200} orientation={Gtk.Orientation.VERTICAL}>
                <label cssClasses={["title"]} halign={Gtk.Align.START}>OpenVPN Connections</label>
                <ConnectionSelector
                    client={client}
                    allConfigs={availableConfigs()}
                    activeSession={client.activeSession()}/>
            </box>
        </popover>
    </menubutton>
}