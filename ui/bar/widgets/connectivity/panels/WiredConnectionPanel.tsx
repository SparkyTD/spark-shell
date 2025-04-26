import {Gtk} from "astal/gtk4";
import DeviceManager from "../device-manager";
import Network from "gi://AstalNetwork"

type Params = {
    manager: DeviceManager,
};

function getWiredStateLabel(state: Network.DeviceState): string {
    if (state == Network.DeviceState.UNKNOWN) {
        return "Unknown";
    } else if (state == Network.DeviceState.DISCONNECTED || state == 20) {
        return "Disconnected";
    } else if (state == Network.DeviceState.ACTIVATED) {
        return "Connected";
    }  else if (state == 70) {
        return "Connecting...";
    } else {
        return state;
    }
}

function formatConnectionSpeed(speed: number): string {
    if (speed >= 1000) {
        return `(${(speed / 1000).toFixed(1)} Gbps)`;
    }

    if (speed >= 100) {
        return `(${(speed / 100).toFixed(1)} Mbps)`;
    }

    if (speed >= 100) {
        return `(${(speed / 10).toFixed(1)} Kbps)`;
    }

    return `(${speed} bps)`;
}

export default function WiredConnectionPanel({manager}: Params) {
    return <box cssClasses={["ethernet"]}>
        {manager.isWiredPresent().as(present => {
            if (present) {
                return <box cssClasses={["content"]} vertical>
                    <label cssClasses={["title"]} halign={Gtk.Align.START}>Ethernet Connection</label>
                    <box>
                        <image iconName={manager.wiredIcon()}/>
                        <box vertical>
                            <box>
                                <label>Ethernet </label>
                                <label>{manager.wiredActiveConnectionSpeed().as(formatConnectionSpeed)}</label>
                            </box>
                            <label halign={Gtk.Align.START}>
                                {manager.wiredConnectionState().as(getWiredStateLabel)}
                            </label>
                        </box>
                    </box>
                </box>
            } else {
                return <box visible={false}></box>
            }
        })}
    </box>;
}