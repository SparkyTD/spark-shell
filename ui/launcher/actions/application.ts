import {ActionCallback, ActionProvider, ActionResult} from "../Launcher";
import Apps from "gi://AstalApps"

export class ApplicationProvider extends ActionProvider {
    matchInput(_: string): boolean {
        return true;
    }

    queryResults(query: string): ActionResult[] {
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
        return this.application.description;
    }

    getIconName(): string | null {
        return this.application.iconName;
    }

    getCategoryName(): string {
        return "Applications";
    }

    getCustomSortOrder(): number {
        return -this.application.frequency;
    }

    getAction(): ActionCallback | null {
        return () => {
            this.application.launch();
            return true;
        };
    }
}