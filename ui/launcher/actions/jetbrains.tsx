// noinspection ES6PreferShortImport

import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {execAsync, Gio, GLib} from "astal";
import Apps from "gi://AstalApps"
import {XMLParser} from "../../../node_modules/fast-xml-parser/lib/fxp.cjs";

export default class JetBrainsActionProvider extends ActionProvider {
    private cachedProjectList: JbProjectEntry[] | null = null;

    queryResults(query: string): ActionResult[] | null {
        if (!query || !query.toLowerCase().startsWith("jb")) {
            return null;
        }

        if (!this.cachedProjectList) {
            let apps = new Apps.Apps();
            let installedJbApps = apps.list
                .filter(a => /^(\w+) (\d{4}\.\d+)$/.test(a.name));

            this.cachedProjectList = [];
            let seenProjectNames: string[] = [];
            let homeDir = GLib.get_home_dir();
            let jbRootDir = Gio.file_new_build_filenamev([homeDir, ".config", "JetBrains"]);
            let children = jbRootDir.enumerate_children("*", Gio.FileQueryInfoFlags.NONE, null);

            let file;
            while (!!(file = children.next_file(null))) {
                if (file.get_file_type() !== Gio.FileType.DIRECTORY)
                    continue;

                let match = /^(\w+)(\d{4}\.\d+)$/.exec(file.get_name());
                if (!match)
                    continue;

                let productType = match[1];
                let jbDataPath = jbRootDir.get_child(file.get_name()).get_child("options");
                let latestProjectsFile = productType == "Rider"
                    ? jbDataPath.get_child("recentSolutions.xml")
                    : jbDataPath.get_child("recentProjects.xml");
                if (!latestProjectsFile.query_exists(null))
                    continue;

                let [success, xmlContentBytes] = latestProjectsFile.load_contents(null);
                if (!success)
                    continue;

                let installedJbApp = installedJbApps
                    .find(a => a.name.startsWith(productType + " "));
                if (!installedJbApp)
                    continue;

                const xmlContent = new TextDecoder().decode(xmlContentBytes);
                const parser = new XMLParser({
                    ignoreAttributes: false,
                    attributeNamePrefix: "attr_",
                    allowBooleanAttributes: true,
                });
                let data = parser.parse(xmlContent).application as JbApplication;
                let additionalInfo = data?.component?.option
                    ?.find(o => o.attr_name == "additionalInfo");
                if (typeof additionalInfo?.map?.entry.map !== "function")
                    continue;

                let projectEntries = additionalInfo?.map?.entry
                    ?.map(e => {
                        return {
                            projectPath: e.attr_key.replace("$USER_HOME$", homeDir),
                            title: e.value.RecentProjectMetaInfo.attr_frameTitle.split(' – ')[0].trim(),
                            binFolder: e.value.RecentProjectMetaInfo.option
                                .find(o => o.attr_name == "binFolder")?.attr_value,
                            build: e.value.RecentProjectMetaInfo.option
                                .find(o => o.attr_name == "build")?.attr_value,
                            productionCode: e.value.RecentProjectMetaInfo.option
                                .find(o => o.attr_name == "productionCode")?.attr_value,
                            projectOpenTimestamp: Number.parseInt(e.value.RecentProjectMetaInfo.option
                                .find(o => o.attr_name == "projectOpenTimestamp")?.attr_value!),
                            application: installedJbApp,
                        } as JbProjectEntry
                    })
                    ?.filter(e => {
                        if (seenProjectNames.includes(e.projectPath))
                            return false;
                        seenProjectNames.push(e.projectPath);

                        return !!e.title &&
                            !!e.projectPath &&
                            !!e.binFolder &&
                            !!e.build &&
                            !!e.productionCode &&
                            !!e.projectOpenTimestamp;
                    });
                if (!projectEntries)
                    continue;

                projectEntries?.forEach(e => this.cachedProjectList!.push(e));
            }
        }

        let searchQuery = query.replaceAll(/^jb/ig, '')
            .toLowerCase()
            .trim();

        let results = this.cachedProjectList
            ?.filter(e => e.title.toLowerCase().includes(searchQuery))
            ?.sort((a, b) => b.projectOpenTimestamp - a.projectOpenTimestamp)
            ?.map(project => new JetBrainsActionResult(project));

        return !!results ? results : null;
    }

    destroy() {
        this.cachedProjectList = null;
    }
}

class JetBrainsActionResult extends ActionResult {
    private readonly entry: JbProjectEntry;

    constructor(entry: JbProjectEntry) {
        super();
        this.entry = entry;
    }

    getTitle(): string {
        return this.entry.title;
    }

    getDescription(): string | null {
        return this.entry.application.name;
    }

    getIconName(): string | null {
        return this.entry.application.iconName;
    }

    getAction(): ActionCallback | null {
        return () => {
            execAsync(this.entry.application.executable.replace("%u", `"${this.entry.projectPath}"`))
                .then(() => {});
            return true;
        };
    }

    getCategoryName(): string {
        return "JetBrains - Recent Projects";
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            <image file={this.getIconName()!}/>,
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
            <label cssClasses={["description"]}>{this.getDescription()}</label>
        ];
    }
}

interface JbApplication {
    component: {
        attr_name: string;
        option: {
            attr_name: string;
            map: {
                entry: {
                    attr_key: string;
                    value: {
                        RecentProjectMetaInfo: {
                            attr_frameTitle: string,
                            attr_projectWorkspaceId: string
                            option: {
                                attr_name: string,
                                attr_value: string,
                            }[]
                        }
                    }
                }[];
            };
        }[];
    };
}

interface JbProjectEntry {
    title: string;
    projectPath: string,
    binFolder: string;
    build: string;
    productionCode: string;
    projectOpenTimestamp: number;
    application: Apps.Application;
}