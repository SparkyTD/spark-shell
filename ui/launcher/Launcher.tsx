import {App, Astal, Gdk, Gtk} from "astal/gtk4"
import Hyprland from "gi://AstalHyprland";
import {Variable, exec, Binding} from "astal";
import {AppConfig} from "../../config";
import {truncateText} from "../../utils/text-utils";
import Apps from "gi://AstalApps"

export default class Launcher {
    private readonly isOpen: Variable<boolean>;
    private readonly monitor: Variable<Gdk.Monitor>;
    private readonly selectedIndex: Variable<number>;
    private readonly filteredResultList: Variable<ActionResultWrapper[]>;
    private readonly subActionProvider: Variable<AsyncActionProvider | null>;
    private readonly subActionResultsLoading: Variable<boolean>;
    private readonly hyprland: Hyprland.Hyprland;
    private readonly window: Astal.Window;
    private actionProviders: ActionProvider[];
    private scrollContainer?: Astal.Box;
    private searchEntry?: Gtk.Entry;
    private launcherContext: LauncherContext | null = null;

    constructor() {
        this.isOpen = Variable(false);
        this.hyprland = Hyprland.get_default();
        this.monitor = Variable(App.get_monitors()[0]);
        this.selectedIndex = Variable(0);
        this.filteredResultList = Variable([]);
        this.subActionProvider = Variable(null);
        this.subActionResultsLoading = Variable(false);
        this.window = this.createWindow();
        this.actionProviders = [];
    }

    public addActionProvider(provider: ActionProvider) {
        this.actionProviders.push(provider);
    }

    createWindow(): Astal.Window {
        return <window
            visible={this.isOpen()}
            cssClasses={["Launcher"]}
            name="launcher"
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            keymode={Astal.Keymode.ON_DEMAND}
            gdkmonitor={this.monitor()}
            application={App}
            widthRequest={600}
            heightRequest={540}
            namespace="astal-launcher-gtk4"
            layer={Astal.Layer.OVERLAY}
            onKeyPressed={(_, key) => this.keyPressed(key)}
            setup={self => {
                if (AppConfig.launcher.enableHyprlandBlur) {
                    exec(["hyprctl", "-r", "--", "keyword", "layerrule", `blur,${self.namespace}`]);
                    exec(["hyprctl", "-r", "--", "keyword", "layerrule", "ignorealpha", `0.0,${self.namespace}`]);
                }
            }}>
            <box cssClasses={["root"]} vertical>
                <box cssClasses={["inner-root"]} vertical>
                    <box cssClasses={["header-row"]}>
                        <button valign={Gtk.Align.CENTER}
                                visible={this.subActionProvider().as(Boolean)}
                                onClicked={() => {
                                    this.subActionProvider.set(null);
                                    this.searchTextChanged("");
                                }}>
                            <image iconName="edit-undo-symbolic"/>
                        </button>
                        <entry
                            hexpand={true}
                            placeholderText="Search for apps and actions..."
                            onChanged={(self) => {
                                this.searchTextChanged(self.text);
                            }}
                            onActivate={() => {
                                this.keyPressed(Gdk.KEY_Return);
                            }}
                            setup={self => {
                                this.searchEntry = self;

                                let controller = new Gtk.EventControllerKey({propagationPhase: Gtk.PropagationPhase.CAPTURE});
                                controller.connect('key-pressed', (_event, key) => {
                                    if (this.handleSelectedItemKeyPress(key))
                                        return;

                                    if (key == Gdk.KEY_BackSpace && self.text === "") {
                                        this.subActionProvider.set(null);
                                        this.searchTextChanged("");
                                    }
                                })
                                self.add_controller(controller);
                            }}/>
                    </box>
                    <box cssClasses={this.subActionResultsLoading().as(loading => loading
                        ? ["widget-separator", "horizontal", "loading"]
                        : ["widget-separator", "horizontal"])}/>
                    <Gtk.ScrolledWindow
                        vexpand={true}
                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                        canFocus={false}>
                        <box cssClasses={["list-root"]} spacing={10} vertical
                             setup={self => this.scrollContainer = self}>
                            {this.filteredResultList().as(appList => {
                                let elements: Gtk.Widget[] = [];
                                let lastCategoryName = "";

                                appList
                                    .forEach((result, index) => {
                                        if (result.result.getCategoryName() != lastCategoryName) {
                                            elements.push(<label cssClasses={["category-header"]}
                                                                 halign={Gtk.Align.START}>
                                                {result.result.getCategoryName()}
                                            </label>)
                                            lastCategoryName = result.result.getCategoryName();
                                        }

                                        elements.push(<button
                                            onClicked={() => {
                                                this.selectedIndex.set(index);
                                                this.keyPressed(Gdk.KEY_Return);
                                            }}
                                            cssClasses={this.selectedIndex()
                                                .as(i => i == index ? ["selected"] : [])}>
                                            <box cssClasses={this.selectedIndex()
                                                .as(i => i == index ? ["item", "selected"] : ["item"])}
                                                 cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                                {result.result.getWidgetContents()}
                                            </box>
                                        </button>);
                                    });

                                return elements;
                            })}
                        </box>
                    </Gtk.ScrolledWindow>
                </box>
            </box>
        </window> as Astal.Window
    }

    static customElementSorting(a: ActionResultWrapper, b: ActionResultWrapper): any {
        // First, check if they're from the same provider
        const sameProvider = a.provider === b.provider;

        if (sameProvider) {
            // If same provider, sort by result's custom sort order (decreasing)
            return b.result.getCustomSortOrder() - a.result.getCustomSortOrder();
        } else {
            // If different providers, sort by provider's custom sort order (decreasing)
            return b.provider.getCustomSortOrder() - a.provider.getCustomSortOrder();
        }
    }

    searchTextChanged(text: string) {
        this.selectedIndex.set(0);

        if (!this.subActionProvider.get()) {
            let allResults = this.actionProviders
                .map(provider => {
                    return {
                        provider: provider,
                        results: provider.queryResults(text, this.launcherContext!),
                    }
                })
                .filter(p => p.results != null)
                .flatMap(p => p.results?.map(r => {
                    return {
                        provider: p.provider,
                        result: r,
                    } as ActionResultWrapper
                }))
                .map(a => a!)
                .sort(Launcher.customElementSorting);

            this.filteredResultList.get().forEach((w) => w.result.destroy());
            this.filteredResultList.set(allResults
                .sort((a, b) =>
                    b!.provider.getCustomSortOrder() - a!.provider.getCustomSortOrder())
                .map(p => p!)
                .sort(Launcher.customElementSorting));
            this.ensureScrollAdjustment();
        } else {
            this.subActionResultsLoading.set(true);
            let allResults = this.subActionProvider.get()!
                .queryResultsAsync(text, this.launcherContext!);
            allResults.then((results: ActionResult[] | null) => {
                if (!results)
                    return;

                this.filteredResultList.get().forEach((result) => result.result.destroy());
                this.filteredResultList.set(results
                    .map(r => {
                        return {provider: this.subActionProvider.get()!, result: r}
                    }));
                this.ensureScrollAdjustment();
            }).finally(() => this.subActionResultsLoading.set(false));
        }
    }

    handleSelectedItemKeyPress(key: number): boolean {
        let selectedItem = this.filteredResultList.get()[this.selectedIndex.get()];
        if (!!selectedItem && selectedItem.result.handleKeyPress(key)) {
            return true;
        }

        return false;
    }

    keyPressed(key: number) {
        if (this.handleSelectedItemKeyPress(key))
            return;

        if (key == Gdk.KEY_Escape) {
            this.hide();
        }

        let selectedIndex = this.selectedIndex.get();
        let itemCount = this.filteredResultList.get().length;
        if (key == Gdk.KEY_Down) {
            this.selectedIndex.set(selectedIndex + 1 < itemCount ? selectedIndex + 1 : 0);
            this.ensureScrollAdjustment();
        }

        if (key == Gdk.KEY_Up) {
            this.selectedIndex.set(selectedIndex > 0 ? selectedIndex - 1 : itemCount - 1);
            this.ensureScrollAdjustment();
        }

        if (key == Gdk.KEY_Return) {
            let selectedItem = this.filteredResultList.get()[this.selectedIndex.get()];
            let action = selectedItem.result.getAction();
            if (!!action && typeof action === "function") {
                if (action()) {
                    this.hide();
                }
            } else if (!!action) {
                this.subActionResultsLoading.set(true);
                action.initAsync(this.launcherContext!).then(() => {
                    this.subActionResultsLoading.set(false);
                    this.filteredResultList.set([]);
                    this.subActionProvider.set(action);
                    this.searchEntry?.set_text("");
                    this.searchTextChanged("");
                }).catch(() => this.subActionResultsLoading.set(false));
            } else {
                this.hide();
            }
        }
    }

    ensureScrollAdjustment() {
        let scrolledWindow = this.scrollContainer?.parent.parent as Gtk.ScrolledWindow;
        let verticalAdjustment = scrolledWindow.get_vadjustment();

        const selectedItem = this.scrollContainer?.children
            .find(c => c.cssClasses.includes("selected"));
        if (!!selectedItem) {
            let itemAllocation = selectedItem.get_allocation();
            let containerAllocation = this.scrollContainer?.parent.get_allocation();
            if (itemAllocation.y + itemAllocation.height > containerAllocation?.height! + verticalAdjustment.get_value()) {
                verticalAdjustment.set_value(itemAllocation.y - containerAllocation?.height! + itemAllocation.height!);
            } else if (itemAllocation.y < verticalAdjustment.get_value()) {
                verticalAdjustment.set_value(itemAllocation.y);
            }
        }
    }

    reloadLauncherContext() {
        this.launcherContext = {
            appList: Apps.Apps.new().list,
        };
    }

    public toggle() {
        const isOpen = this.isOpen.get();
        if (isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        this.reloadLauncherContext();

        this.subActionResultsLoading.set(false);
        this.subActionProvider.set(null);
        this.searchEntry!.text = "";
        this.searchTextChanged("");

        const monitors = App.get_monitors();
        this.monitor?.set(monitors[this.hyprland.focusedMonitor.id]);
        this.selectedIndex.set(0);
        this.isOpen.set(true);
    }

    public hide() {
        this.filteredResultList.get().forEach((result) => result.result.destroy());
        this.actionProviders.forEach(provider => provider.destroy());
        this.isOpen.set(false);
    }
}

export type LauncherContext = {
    appList: Apps.Application[],
};

type ActionResultWrapper = {
    result: ActionResult;
    provider: ActionProvider | AsyncActionProvider;
}

export abstract class ActionProvider {
    abstract queryResults(query: string, context: LauncherContext): ActionResult[] | null;

    getCustomSortOrder(): number {
        return 0;
    }

    destroy() {
    }
}

export abstract class AsyncActionProvider {
    abstract queryResultsAsync(query: string, context: LauncherContext): Promise<ActionResult[] | null>;

    initAsync(_context: LauncherContext): Promise<void> {
        return Promise.resolve();
    }

    getCustomSortOrder(): number {
        return 0;
    }

    destroy() {
    }
}

export type ActionCallback = () => boolean;
export type OptionalWidget = Gtk.Widget | Binding<Gtk.Widget> | null;

export abstract class ActionResult {
    abstract getTitle(): string;

    getDescription(): string | null {
        return null;
    }

    abstract getIconName(): string | null;

    abstract getCategoryName(): string;

    getCustomSortOrder(): number {
        return 0;
    }

    handleKeyPress(key: number): boolean {
        return false;
    }

    abstract getAction(): ActionCallback | AsyncActionProvider | null;

    abstract getWidgetContents(): OptionalWidget[];

    destroy() {
    }
}

export class SimpleCommandActionResult extends ActionResult {
    private readonly title: string;
    private readonly description?: string;
    private readonly iconName?: string;
    private readonly categoryName: string;
    private readonly callback: ActionCallback | AsyncActionProvider | null;
    private readonly priority: number;

    constructor(title: string, description: string, iconName: string, categoryName: string, callback: ActionCallback | AsyncActionProvider | null, priority?: number) {
        super();
        this.title = title;
        this.description = description;
        this.iconName = iconName;
        this.categoryName = categoryName ?? "Results";
        this.callback = callback;
        this.priority = priority ?? 0;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string | null {
        return !!this.description ? this.description : null;
    }

    getIconName(): string | null {
        return !!this.iconName ? this.iconName : null;
    }

    getCategoryName(): string {
        return this.categoryName!;
    }

    getCustomSortOrder(): number {
        return this.priority;
    }

    getAction(): ActionCallback | AsyncActionProvider | null {
        return this.callback;
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getAppIcon(),
            <label cssClasses={["title"]}>{this.getTitle()}</label>,
            <label cssClasses={["description"]}>
                {truncateText(this.getDescription(), 80)}
            </label>
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