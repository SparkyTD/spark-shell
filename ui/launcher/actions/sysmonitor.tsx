import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";

export class SystemMonitorProvider extends ActionProvider {
    matchInput(_: string): boolean {
        return true;
    }

    queryResults(query: string): ActionResult[] {
        let results = [
            new SystemMonitorItem(MonitorType.Cpu),
            new SystemMonitorItem(MonitorType.Ram),
        ];

        return results.filter(o =>
            o.type.toString().toLowerCase().includes(query.toLowerCase())
            || query.toLowerCase().includes("monitor")
        );
    }
}

enum MonitorType {
    Cpu = "CPU",
    Ram = "RAM",
}

class SystemMonitorItem extends ActionResult {
    public type: MonitorType;

    constructor(type: MonitorType) {
        super();
        this.type = type;
    }

    getTitle(): string {
        return `${this.type} TODO`;
    }

    getIconName(): string | null {
        if (this.type == MonitorType.Cpu) {
            return "power-profile-performance-symbolic";
        } else if (this.type == MonitorType.Ram) {
            return "media-flash-symbolic";
        }

        return null;
    }

    getCategoryName(): string {
        return "System Monitor";
    }

    getAction(): ActionCallback | null {
        return null;
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["title"]}>{this.getTitle()}</label>
        ];
    }
}