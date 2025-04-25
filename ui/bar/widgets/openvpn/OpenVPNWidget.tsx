import {Gdk, Gtk} from "astal/gtk4";
import {Config, getClientInstance, Session, Status} from "./daemon-client";
import {Variable} from "astal";
import OpenVPNPopup from "./OpenVPNPopup";

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

        <OpenVPNPopup client={client} availableConfigs={availableConfigs}/>
    </menubutton>
}