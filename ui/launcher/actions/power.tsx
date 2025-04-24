import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {exec, Variable} from "astal";

export class PowerActionProvider extends ActionProvider {
    matchInput(_: string): boolean {
        return true;
    }

    queryResults(query: string): ActionResult[] {
        let options = [
            new PowerActionResult(PowerAction.Shutdown),
            new PowerActionResult(PowerAction.Reboot),
        ];

        return options.filter(o =>
            o.action.toString().toLowerCase().includes(query.toLowerCase())
        );
    }
}

enum PowerAction {
    Reboot = "Reboot",
    Shutdown = "Shutdown",
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
        }

        return null;
    }

    getAction(): ActionCallback | null {
        return () => {
            if (!this.confirm.get()) {
                this.confirm.set(true);
                return false;
            } else {
                console.log("PowerAction:", this.action.toString());
                if (this.action === PowerAction.Reboot) {
                    exec(["reboot"]);
                } else if (this.action === PowerAction.Shutdown) {
                    exec(["shutdown", "now"]);
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
                if (!confirm) {
                    return <label cssClasses={["title"]}>{this.getTitle()}</label>
                } else {
                    return <label cssClasses={["title", "warn"]}>{`Press Enter again to ${this.getTitle()}`}</label>
                }
            })
        ];
    }
}