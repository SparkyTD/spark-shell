import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {Variable, GLib} from "astal";
import {Gdk} from "astal/gtk4";
import Soup from "gi://Soup?version=3.0";
import Network from "gi://AstalNetwork"

export default class IpAddressActionProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        if (!query || !(query.toLowerCase() == "ip" || query.toLowerCase() == "my ip" || query.toLowerCase() == "myip"))
            return null;

        let network = Network.get_default();

        let entries: IpAddressActionResult[] = network.client.devices.map(d => {
            let address = d.ip4Config.get_addresses().find(() => true)?.get_address();
            if (!address || address == "127.0.0.1")
                return null;

            let addressVariable = Variable(address);
            return new IpAddressActionResult("asd", d.interface, addressVariable);
        }).filter(a => a != null);

        let wanAddress = Variable("fetching...");
        entries.push(new IpAddressActionResult("asd", "wan", wanAddress));
        let session = new Soup.Session();
        let message = Soup.Message.new('GET', "https://eth0.me/");
        session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
            let response = session?.send_and_read_finish(result);
            let responseText = new TextDecoder().decode(response?.toArray()).trim();
            wanAddress.set(responseText);
        });

        return entries;
    }
}

class IpAddressActionResult extends ActionResult {
    private readonly iconName: string;
    private readonly interfaceName: string;
    private readonly address: Variable<string | null>;

    constructor(iconName: string, interfaceName: string, address: Variable<string | null>) {
        super();
        this.iconName = iconName;
        this.interfaceName = interfaceName;
        this.address = address;
    }

    getTitle(): string {
        return "";
    }

    getDescription(): string | null {
        return this.interfaceName;
    }

    getIconName(): string | null {
        return this.iconName;
    }

    getCategoryName(): string {
        return "IP Addresses";
    }

    getAction(): ActionCallback | null {
        return () => {
            Gdk.Display.get_default()?.get_clipboard().set(this.address.get());
            return true;
        };
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["title"]}>{this.address()}</label>,
            <label cssClasses={["description"]}>{this.getDescription()}</label>,
        ];
    }
}