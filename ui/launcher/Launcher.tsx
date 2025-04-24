import {App, Astal, Gdk, Gtk} from "astal/gtk4"
import Hyprland from "gi://AstalHyprland";
import {Variable, exec, Binding} from "astal";
import Separator from "../bar/Separator";

export default class Launcher {
    private readonly isOpen: Variable<boolean>;
    private readonly monitor: Variable<Gdk.Monitor>;
    private readonly selectedIndex: Variable<number>;
    private readonly filteredResultList: Variable<ActionResult[]>;
    private readonly hyprland: Hyprland.Hyprland;
    private readonly window: Astal.Window;
    private actionProviders: ActionProvider[];
    private scrollContainer?: Astal.Box;
    private searchEntry?: Gtk.Entry;

    constructor() {
        this.isOpen = Variable(false);
        this.hyprland = Hyprland.get_default();
        this.monitor = Variable(App.get_monitors()[0]);
        this.selectedIndex = Variable(0);
        this.filteredResultList = Variable([]);
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
            keymode={Astal.Keymode.EXCLUSIVE}
            gdkmonitor={this.monitor()}
            application={App}
            widthRequest={600}
            heightRequest={540}
            layer={Astal.Layer.OVERLAY}
            onKeyPressed={(_, key) => this.keyPressed(key)}
            setup={self => {
                exec(["hyprctl", "-r", "--", "keyword", "layerrule", `blur,${self.namespace}`]);
                exec(["hyprctl", "-r", "--", "keyword", "layerrule", "ignorealpha", `0.0,${self.namespace}`]);
            }}>
            <box cssClasses={["root"]} vertical>
                <box cssClasses={["inner-root"]} vertical>
                    <entry
                        placeholderText="Search for apps and actions..."
                        onChanged={(self) => {
                            this.searchTextChanged(self.text);
                        }}
                        onActivate={() => {
                            this.keyPressed(Gdk.KEY_Return);
                        }}
                        setup={self => this.searchEntry = self}/>
                    <Separator orientation={'horizontal'}/>
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
                                    .sort(Launcher.customElementSorting)
                                    .forEach((result, index) => {
                                        if (result.getCategoryName() != lastCategoryName) {
                                            elements.push(<label cssClasses={["category-header"]}
                                                                 halign={Gtk.Align.START}>
                                                {result.getCategoryName()}
                                            </label>)
                                            lastCategoryName = result.getCategoryName();
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
                                                {result.getWidgetContents()}
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

    static customElementSorting(a: ActionResult, b: ActionResult): any {
        // First compare by category name
        const categoryComparison = a.getCategoryName().localeCompare(b.getCategoryName());

        // If categories are the same, compare by custom sort index
        if (categoryComparison === 0) {
            return a.getCustomSortOrder() - b.getCustomSortOrder();
        }

        // Otherwise, return the category comparison result
        return categoryComparison;
    }

    searchTextChanged(text: string) {
        this.selectedIndex.set(0);

        let allResults = this.actionProviders
            .filter(provider => provider.matchInput(text))
            .flatMap(provider => provider.queryResults(text));

        this.filteredResultList.get().forEach((result) => result.destroy());
        this.filteredResultList.set(allResults);
        this.ensureScrollAdjustment();
    }

    keyPressed(key: number) {
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
            let action = selectedItem.getAction();
            if (!!action) {
                if (action()) {
                    this.hide();
                }
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

    public toggle() {
        const isOpen = this.isOpen.get();
        if (isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        const monitors = App.get_monitors();
        this.searchEntry!.text = "";
        this.searchTextChanged("");

        this.monitor?.set(monitors[this.hyprland.focusedMonitor.id]);
        this.selectedIndex.set(0);
        this.isOpen.set(true);
    }

    public hide() {
        this.filteredResultList.get().forEach((result) => result.destroy());
        this.isOpen.set(false);
    }
}

export abstract class ActionProvider {
    abstract matchInput(input: string): boolean;

    abstract queryResults(query: string): ActionResult[];
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

    abstract getAction(): ActionCallback | null;

    abstract getWidgetContents(): OptionalWidget[];

    destroy() {
    }
}