import {Variable} from "astal";
import Soup from "gi://Soup?version=3.0";
import {Gdk} from "astal/gtk4";
import {AppConfig} from "../../../../config";

export default function AwbTrackingWidget() {
    let config = AppConfig.bar.widgets.awb;
    if (!config) {
        return <box></box>;
    }

    const title = Variable("");
    const tooltip = Variable("");

    const poll = Variable<string>("").poll(60000, () => {
        let queryUrl = config!.apiUrl.replace("$awb", config!.awb);

        let session = new Soup.Session();
        let message = Soup.Message.new('GET', queryUrl);
        let responseBytes = session.send_and_read(message, null);
        let responseString = new TextDecoder().decode(responseBytes.toArray());
        let data = JSON.parse(responseString);

        title.set(config?.titleJsonEval(data));
        tooltip.set(config?.tooltipJsonEval(data));

        return data.status;
    });

    return <menubutton cssClasses={["widget-awb", "bar-button"]}
                       cursor={Gdk.Cursor.new_from_name("pointer", null)}
                       tooltipText={tooltip()}>
        <label
            onDestroy={() => poll.drop()}
            label={title()}/>
    </menubutton>
}