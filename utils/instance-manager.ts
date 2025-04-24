import {Gio, GLib, exec} from "astal";
import { exit } from "system"

export enum MultiInstanceMode {
    KillExisting,
    Crash
}

export class InstanceManager {
    private readonly instanceName: string;
    private readonly multiInstanceMode: MultiInstanceMode;

    constructor(instanceName: string = "astal", multiInstanceMode: MultiInstanceMode) {
        this.instanceName = instanceName;
        this.multiInstanceMode = multiInstanceMode;
    }

    public initialize() {
        let pidFile = this.getPidFile();
        if (!pidFile) {
            return;
        }

        if (pidFile.query_exists(null)) {
            let [success, content, _] = pidFile.load_contents(null);
            if (success && content) {
                let pidText = new TextDecoder().decode(content);
                let pid = Number.parseInt(pidText, 10);

                if (this.multiInstanceMode == MultiInstanceMode.KillExisting) {
                    let otherProcessFile = Gio.File.new_for_path(`/proc/${pid}/cmdline`);
                    if (otherProcessFile && otherProcessFile.query_exists(null)) {
                        let [success, content, _] = otherProcessFile.load_contents(null);
                        if (success) {
                            let cmdLine = new TextDecoder().decode(content).split('\0');
                            if (cmdLine && cmdLine.length > 0 && cmdLine[0] === "gjs") {
                                exec(["kill", "-9", `${pid}`]);
                                GLib.usleep(1000 * 100);
                            }
                        }
                    }
                } else if (this.multiInstanceMode == MultiInstanceMode.Crash) {
                    console.log(`Another instance of '${this.instanceName}' is already running`);
                    exit(1);
                }
            }
        }

        let credentials = new Gio.Credentials();
        let myPid = `${credentials.get_unix_pid()}`;
        if (!pidFile.query_exists(null))
            pidFile.create(Gio.FileCreateFlags.NONE, null);
        pidFile.replace_contents(myPid, null, false, Gio.FileCreateFlags.NONE, null);
    }

    getPidFile(): Gio.File {
        let pidFilePath = GLib.build_filenamev([".", `.pid_${this.instanceName}`]);
        return Gio.File.new_for_path(pidFilePath);
    }

    public getInstanceName(): string {
        return this.instanceName;
    }
}