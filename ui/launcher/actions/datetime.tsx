import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {evaluateExpression} from "../../../utils/datetime-utils";

export default class DateTimeActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        if (!query || query.length < 3) {
            return null;
        }

        let result = evaluateExpression(query);
        if (!result) {
            return null;
        }

        return [
            new DateTimeActionResult([
                <image iconName="x-office-calendar-symbolic"/>,
                <label cssClasses={["description"]}>
                    {`= `}
                </label>,
                <label cssClasses={["title"]}>
                    {`${result.resultDateTime.format(result.resultDisplayFormat)}`}
                </label>,
                <label cssClasses={["description"]}>
                    {`${result.resultTimeZone.name}`}
                </label>,
            ])
        ];
    }
}

class DateTimeActionResult extends ActionResult {
    private readonly widgets: OptionalWidget[];

    constructor(widgets: OptionalWidget[]) {
        super();
        this.widgets = widgets;
    }

    getTitle(): string {
        return "";
    }

    getIconName(): string | null {
        return null;
    }

    getAction(): ActionCallback | null {
        return null;
    }

    getCategoryName(): string {
        return "Date/Time Utilities";
    }

    getWidgetContents(): OptionalWidget[] {
        return this.widgets;
    }
}