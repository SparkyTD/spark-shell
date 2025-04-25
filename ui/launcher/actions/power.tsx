import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {exec, Variable} from "astal";

export class PowerActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        let options = [
            new PowerActionResult(PowerAction.Shutdown),
            new PowerActionResult(PowerAction.Reboot),
            new PowerActionResult(PowerAction.Sleep),
        ];

        return options.filter(o =>
            o.action.toString().toLowerCase().includes(query.toLowerCase())
                || "power".includes(query.toLowerCase())
        );
    }
}

enum PowerAction {
    Reboot = "Reboot",
    Shutdown = "Shutdown",
    Sleep = "Sleep",
}

class PowerActionResult extends ActionResult {
    public readonly action: PowerAction;
    private readonly confirm: Variable<boolean>;

    constructor(action: PowerAction) {
        super();
        this.action = action;
        this.confirm = Variable(false);
    }

    getTitle(): string {
        return this.action.toString();
    }

    getIconName(): string | null {
        if (this.action === PowerAction.Reboot) {
            return "system-reboot-symbolic";
        } else if (this.action === PowerAction.Shutdown) {
            return "system-shutdown-symbolic";
        } else if (this.action === PowerAction.Sleep) {
            return "weather-clear-night-symbolic";
        }

        return null;
    }

    getAction(): ActionCallback | null {
        return () => {
            if (!this.confirm.get()) {
                this.confirm.set(true);
                return false;
            } else {
                if (this.action === PowerAction.Reboot) {
                    exec(["reboot"]);
                } else if (this.action === PowerAction.Shutdown) {
                    exec(["shutdown", "now"]);
                } else if (this.action === PowerAction.Sleep) {
                    exec(["systemctl", "suspend"]);
                }
                return true;
            }
        };
    }

    getCategoryName(): string {
        return "Power";
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            this.confirm().as(confirm => {
                return confirm
                    ? <label cssClasses={["title", "warn"]}>{`Press Enter again to ${this.getTitle()}`}</label>
                    : <label cssClasses={["title"]}>{this.getTitle()}</label>
            }),
            <label cssClasses={["description"]}>
                {this.getDescription()}
            </label>,
        ];
    }
}