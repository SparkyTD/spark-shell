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
            return "";

        return session.config.name;
    }

    const getSessionIcon = (session: Session) => {
        if (!session || session.status === Status.Stopped) {
            return "network-vpn-disabled-symbolic";
        } else if (session.status === Status.Running) {
            return "network-vpn-symbolic";
        } else {
            return "network-vpn-acquiring-symbolic";
        }
    };

    const availableConfigs: Variable<Config[]> = Variable([]);
    client.getConfigsCallback((_error, configs) => {
        availableConfigs.set(configs!);
    });

    return <menubutton cssClasses={["widget-openvpn", "bar-button"]}
                       cursor={Gdk.Cursor.new_from_name("pointer", null)}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <image iconName={client.activeSession().as(s => getSessionIcon(s!))}/>
            <label visible={client.activeSession().as(Boolean)}>
                {client.activeSession().as(s => getSessionName(s!))}
            </label>
        </box>

        <OpenVPNPopup client={client} availableConfigs={availableConfigs}/>
    </menubutton>
}