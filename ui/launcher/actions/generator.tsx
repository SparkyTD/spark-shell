import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {GLib} from "astal";
import {Gdk} from "astal/gtk4";
import {ulid} from "ulid";

export class GeneratorActionProvider extends ActionProvider {
    matchInput(input: string): boolean {
        return input.toLowerCase().startsWith("guid")
            || input.toLowerCase().startsWith("uuid")
            || input.toLowerCase().startsWith("ulid");
    }

    queryResults(query: string): ActionResult[] {
        if (query.toLowerCase().startsWith("guid") || query.toLowerCase().startsWith("uuid")) {
            return [new GeneratorActionResult("UUIDv4", GLib.uuid_string_random())]
        } else if (query.toLowerCase().startsWith("ulid")) {
            return [new GeneratorActionResult("ULID", ulid())]
        }
        return [];
    }
}

class GeneratorActionResult extends ActionResult {
    private readonly type: string;
    private readonly result: string;

    constructor(type: string, result: string) {
        super();
        this.type = type;
        this.result = result;
    }

    getAction(): ActionCallback | null {
        return () => {
            Gdk.Display.get_default()?.get_clipboard().set(this.result);
            return true;
        };
    }

    getCategoryName(): string {
        return "Generator Utilities";
    }

    getIconName(): string | null {
        return "dialog-question-symbolic";
    }

    getTitle(): string {
        return this.result;
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["description"]}>{`${this.type}: `}</label>,
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
            <label cssClasses={["description"]}>Press Enter to copy</label>,
        ];
    }
}