import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {execAsync, GLib} from "astal";
import {truncateText} from "../../../utils/text-utils";
import {AppConfig} from "../../../config";

export class SshActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        if (!query || !query.toLowerCase().startsWith("ssh"))
            return null;

        let parts = query.split(" ");
        if (parts.length == 2 && parts[0] == "ssh") {
            let sshStringMatch = /^(?<username>[\w._-]+)@(?<hostname>[\w._-]+)(?::(?<port>\d{1,5}))?$/
                .exec(parts[1]);
            if (sshStringMatch) {
                return [new SshActionResult({
                    profileName: undefined,
                    username: sshStringMatch[1],
                    hostName: sshStringMatch[2],
                    port: Number.parseInt(sshStringMatch[3] ?? "22"),
                })]
            }
        } else {
            let configProfiles = parseSshConfig();
            return configProfiles.map(p => new SshActionResult(p));
        }

        return null;
    }
}

class SshActionResult extends ActionResult {
    private profile: SshProfile;

    constructor(profile: SshProfile) {
        super();
        this.profile = profile;
    }

    getTitle(): string {
        return this.getSshConnectionString()
    }

    getDescription(): string {
        if (!!this.profile.profileName)
            return `${this.profile.username}@${this.profile.hostName}:${this.profile.port}`;

        return "";
    }

    getIconName(): string | null {
        return "network-wireless-encrypted-symbolic";
    }

    getAction(): ActionCallback | null {
        return () => {
            let terminal = AppConfig.defaults.terminal;
            let command = [terminal, "ssh", this.getSshConnectionString()];
            if (terminal == "kitty") {
                command.splice(1, 0, "--hold");
            }
            execAsync(command).then(() => {});
            return true;
        };
    }

    getSshConnectionString() {
        if (!!this.profile.profileName)
            return this.profile.profileName;

        return `${this.profile.username}@${this.profile.hostName}:${this.profile.port}`;
    }

    getCategoryName(): string {
        return "SSH";
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            <image iconName={this.getIconName()!}/>,
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
            <label cssClasses={["description"]}>
                {truncateText(this.getDescription(), 80)}
            </label>
        ];
    }
}

type SshProfile = {
    profileName?: string;
    hostName: string;
    username: string;
    port?: number;
    identityFile?: string;
}

function parseSshConfig(): SshProfile[] {
    let [success, bytes] = GLib.file_get_contents(GLib.build_filenamev([GLib.get_home_dir(), ".ssh", "config"]));
    if (!success) {
        return [];
    }

    let text = new TextDecoder().decode(bytes);
    let lines = text.split("\n");

    let profiles: SshProfile[] = [];

    lines.forEach(line => {
        if (!line || line.length == 0)
            return;

        let hostMatch = /^\s*Host\s+(\w+)\s*$/i.exec(line);
        if (hostMatch) {
            profiles.push({
                profileName: hostMatch[1],
                port: 22,
                hostName: "",
                username: "user",
            });
        }

        let hostNameMatch = /^\s*HostName\s+([\w._-]+)\s*$/i.exec(line);
        if (hostNameMatch && profiles.length > 0) {
            profiles[profiles.length - 1].hostName = hostNameMatch[1];
        }

        let userMatch = /^\s*User\s+([\w._-]+)\s*$/i.exec(line);
        if (userMatch && profiles.length > 0) {
            profiles[profiles.length - 1].username = userMatch[1];
        }

        let portMatch = /^\s*Port\s+(\d+)\s*$/i.exec(line);
        if (portMatch && profiles.length > 0) {
            profiles[profiles.length - 1].port = Number.parseInt(portMatch[1]);
        }

        let identityFileMatch = /^\s*IdentityFile\s+(.+)$/i.exec(line);
        if (identityFileMatch && profiles.length > 0) {
            profiles[profiles.length - 1].identityFile = identityFileMatch[1];
        }
    });

    return profiles;
}