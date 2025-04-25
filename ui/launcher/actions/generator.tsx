import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {GLib} from "astal";
import {Gdk} from "astal/gtk4";
import {ulid} from "ulid";

export class GeneratorActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        let type = this.parseIdType(query.split(' ')[0]);
        if (type == null)
            return null;

        return [new GeneratorActionResult(type)];
    }

    parseIdType(text: string): IdType | null {
        if (text.toLowerCase() == "uuid" || text.toLowerCase() == "guid") {
            return IdType.UUID;
        } else if (text.toLowerCase() == "ulid") {
            return IdType.ULID;
        }

        return null;
    }
}

enum IdType {
    UUID = "UUIDv4",
    ULID = "ULID",
}

class GeneratorActionResult extends ActionResult {
    private readonly type: IdType;
    private readonly result: string;

    constructor(type: IdType) {
        super();
        this.type = type;
        this.result = type == IdType.UUID ? GLib.uuid_string_random() : ulid();
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