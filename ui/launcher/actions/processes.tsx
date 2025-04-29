import {
    ActionCallback,
    ActionProvider,
    ActionResult,
    AsyncActionProvider,
    LauncherContext, OptionalWidget,
    SimpleCommandActionResult
} from "../Launcher";
import {exec, execAsync, Gio, Variable} from "astal";
import {truncateTextMiddle} from "../../../utils/text-utils";
import {Gdk, Gtk} from "astal/gtk4";

export default class ProcessesActionProvider extends ActionProvider {
    queryResults(query: string, context: LauncherContext): ActionResult[] | null {
        query = query.toLowerCase().trim();
        if (!query || !query.startsWith("proc")) {
            return null;
        }

        return [new SimpleCommandActionResult(
            "Running processes",
            "List currently running processes and kill misbehaving ones",
            "power-profile-performance-symbolic",
            "Running Processes",
            new ProcessListActionProvider()
        )];
    }

    getCustomSortOrder(): number {
        return Number.MAX_SAFE_INTEGER;
    }
}

class ProcessListActionProvider extends AsyncActionProvider {
    private static readonly RE_PROC_ENTRY = /^\s*(?<pid>\d+)\s+(?<ppid>\d+)\s+(?<cpu>\d+\.\d+)\s+(?<ram>\d+)\s+(?!\[)(?<cmd>.+)$/;
    private processList: ProcessEntry[] = [];
    private totalMemoryKb = 0;

    async initAsync(_context: LauncherContext): Promise<void> {
        let result = await execAsync(["ps", "-eo", "pid,ppid,%cpu,rss,cmd", "--cols", "1000"]);
        this.processList = result.split('\n')
            .map(str => ProcessListActionProvider.RE_PROC_ENTRY.exec(str))
            .filter(arr => !!arr)
            .map(arr => {
                return {
                    pid: Number.parseInt(arr[1]),
                    ppid: Number.parseInt(arr[2]),
                    cpuPercentage: Number.parseFloat(arr[3]),
                    ramKb: Number.parseFloat(arr[4]),
                    command: arr[5],
                } as ProcessEntry
            });

        let memInfoFile = Gio.File.new_for_path("/proc/meminfo");
        let [memInfoBytes, _] = await memInfoFile.load_contents_async(null);
        let memInfoLines = new TextDecoder().decode(memInfoBytes).split('\n');
        let memTotalLine = memInfoLines.find(l => l.startsWith('MemTotal:'))!;
        this.totalMemoryKb = Number.parseInt(memTotalLine.split(' ').filter(l => !!l)[1]);

        return Promise.resolve();
    }

    queryResultsAsync(query: string, context: LauncherContext): Promise<ActionResult[] | null> {
        return Promise.resolve(this.processList
            .filter(p => p.command.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 64)
            .sort((a, b) => b.cpuPercentage - a.cpuPercentage)
            .map(process => new ProcessListActionResult(process)));
    }
}

class ProcessListActionResult extends ActionResult {
    private readonly entry: ProcessEntry;
    private readonly isDetailsOpen: Variable<boolean>;
    private wasKillAttempted: boolean = false;

    constructor(entry: ProcessEntry) {
        super();
        this.entry = entry;
        this.isDetailsOpen = Variable(false);
    }

    getTitle(): string {
        return this.entry.command;
    }

    getIconName(): string | null {
        return "power-profile-performance-symbolic";
    }

    getAction(): ActionCallback | AsyncActionProvider | null {
        return () => {
            this.isDetailsOpen.set(true);
            return false;
        };
    }

    getCategoryName(): string {
        return "Running Processes";
    }

    handleKeyPress(key: number): boolean {
        if (!this.isDetailsOpen.get())
            return false;

        if (key == Gdk.KEY_BackSpace || key == Gdk.KEY_Escape) {
            this.isDetailsOpen.set(false);
        } else if (key == Gdk.KEY_F9 && !this.wasKillAttempted) {
            exec(["kill", "-9", `${this.entry.pid}`])
            this.wasKillAttempted = true;
        } else if (key == Gdk.KEY_F5) {
            Gdk.Display.get_default()?.get_clipboard().set(`${this.entry.command}`);
        }

        return true;
    }

    getWidgetContents(): OptionalWidget[] {
        return [<box vertical>
            <box cssClasses={["item"]} hexpand={true}>
                <image iconName={this.getIconName()!}/>
                <centerbox hexpand={true}>
                    <label cssClasses={["title"]}>
                        {truncateTextMiddle(this.getTitle(), 86)}
                    </label>
                    <box hexpand={true}></box>
                    <box>
                        <label>CPU:&nbsp;</label>
                        <label>{`${this.entry.cpuPercentage.toFixed(1)}%; `}</label>
                        <label>RAM:&nbsp;</label>
                        <label>{`${this.formatMemUsage(this.entry.ramKb)}`}</label>
                    </box>
                </centerbox>
                <box widthRequest={16}></box>
            </box>
            <revealer revealChild={this.isDetailsOpen()}
                      cssClasses={this.isDetailsOpen().as(o => o ? ["open"] : [])}>
                <box hexpand={true} vertical>
                    <centerbox>
                        <box vertical>
                            <label cssClasses={["description"]} halign={Gtk.Align.START}>PID</label>
                            <label cssClasses={["description"]} halign={Gtk.Align.START}>CPU Usage</label>
                            <label cssClasses={["description"]} halign={Gtk.Align.START}>Memory Usage</label>
                            <label cssClasses={["description"]} halign={Gtk.Align.START}>Command</label>
                        </box>
                        <box vertical>
                            <label cssClasses={["title"]} halign={Gtk.Align.START}>{this.entry.pid}</label>
                            <label cssClasses={["title"]} halign={Gtk.Align.START}>{`${this.entry.cpuPercentage.toFixed(2)}%`}</label>
                            <label cssClasses={["title"]} halign={Gtk.Align.START}>{`${this.formatMemUsage(this.entry.ramKb)}`}</label>
                            <label cssClasses={["title"]} halign={Gtk.Align.START}>{truncateTextMiddle(this.entry.command, 64)}</label>
                        </box>
                        <box hexpand={true}></box>
                    </centerbox>
                    <box cssClasses={["footer"]}>
                        <box cssClasses={["shortcut"]}>
                            <label>Kill: F9</label>
                        </box>
                        <box cssClasses={["shortcut"]}>
                            <label>Copy Command: F5</label>
                        </box>
                    </box>
                </box>
            </revealer>
        </box>];
    }

    formatMemUsage(kb: number): string {
        if (kb >= 1024 * 1024)
            return `${(kb / 1024 / 1024).toFixed(2)} GB`;
        else if (kb >= 1024)
            return `${(kb / 1024).toFixed(2)} MB`;

        return `${kb.toFixed(2)} kB`;
    }
}

interface ProcessEntry {
    pid: number;
    ppid: number;
    command: string,
    cpuPercentage: number,
    ramKb: number,
}