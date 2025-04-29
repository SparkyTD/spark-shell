import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import Apps from "gi://AstalApps"
import {truncateText} from "../../../utils/text-utils";

export class ApplicationProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        let apps = new Apps.Apps();
        return apps.list
            .filter(app => this.applicationMatches(app, query))
            .map(app => new ApplicationResult(app));
    }

    applicationMatches(app: Apps.Application, keyword: string): boolean {
        if (!keyword || keyword.length == 0)
            return true;

        if (!!app.name && app.name.toLowerCase().includes(keyword.toLowerCase()))
            return true;

        if (!!app.description && app.description.toLowerCase().includes(keyword.toLowerCase()))
            return true;

        if (!!app.executable && app.executable.toLowerCase().includes(keyword.toLowerCase()))
            return true;

        return false;
    }
}

class ApplicationResult extends ActionResult {
    private application: Apps.Application

    constructor(app: Apps.Application) {
        super();
        this.application = app;
    }

    getTitle(): string {
        return this.application.name;
    }

    getDescription(): string | null {
        return this.application.iconName;
    }

    getIconName(): string | null {
        let iconName = this.application.iconName;
        if (!iconName || iconName.length == 0)
            return "missing-symbolic";
        return iconName;
    }

    getCategoryName(): string {
        return "Applications";
    }

    getCustomSortOrder(): number {
        return this.application.frequency;
    }

    getAction(): ActionCallback | null {
        return () => {
            this.application.launch();
            return true;
        };
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getAppIcon(),
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
            <label cssClasses={["description"]}>
                {truncateText(this.getDescription(), 80)}
            </label>,
        ];
    }

    getAppIcon(): OptionalWidget {
        let iconName = this.getIconName() ?? "missing-symbolic";
        if (iconName == null)
            return null;

        if (iconName.startsWith("/"))
            return <image file={this.getIconName()!}/>
        else
            return <image iconName={this.getIconName()!}/>
    }
}