import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {truncateTextMiddle} from "../../../utils/text-utils";
import {Gdk} from "astal/gtk4";
import {exec} from "astal";

export class BalooSearchActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        if (!query || !(query.toLowerCase().startsWith("search") || query.toLowerCase().startsWith("s ")))
            return null;

        let searchQuery = query.replaceAll(/^((s )|search)/gi, '');
        if (searchQuery.length < 3)
            return null;


        let resultLines = exec(["baloosearch6", searchQuery])
            .split("\n")
            .slice(0, 32);

        return resultLines.map(path => new BalooSearchActionResult(path));
    }
}

class BalooSearchActionResult extends ActionResult {
    private readonly filePath: string;

    constructor(filePath: string) {
        super();
        this.filePath = filePath;
    }

    getTitle(): string {
        return truncateTextMiddle(this.filePath, 100)!;
    }

    getIconName(): string | null {
        return "folder-documents-symbolic";
    }

    getCategoryName(): string {
        return "Search Files";
    }

    getAction(): ActionCallback | null {
        return () => {
            Gdk.Display.get_default()?.get_clipboard().set(this.filePath);
            return true;
        };
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
        ];
    }
}