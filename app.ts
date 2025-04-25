import {App, Gdk} from "astal/gtk4"
import Bar from "./ui/bar/Bar"
import Launcher from "./ui/launcher/Launcher";
import HotReloadStylesManager from "./utils/scss-reload";
import {InstanceManager, MultiInstanceMode} from "./utils/instance-manager";
import SocketManager from "./utils/socket-manager";
import {ApplicationProvider} from "./ui/launcher/actions/application";
import {CalculatorProvider, testMain} from "./ui/launcher/actions/calculator";
import {CurrencyExchangeProvider} from "./ui/launcher/actions/currency";
import {PowerActionProvider} from "./ui/launcher/actions/power";
import {exit} from "system";
import {GeneratorActionProvider} from "./ui/launcher/actions/generator";
import initPRNG from "./utils/prng";

//testMain();
//exit(0);

initPRNG();

let stylesManager = new HotReloadStylesManager("./styles/init.scss");
stylesManager.watchInputFiles();

let instanceManager = new InstanceManager("astal", MultiInstanceMode.KillExisting);
instanceManager.initialize();

App.start({
    css: stylesManager.getOutputFile(),
    instanceName: instanceManager.getInstanceName(),
    main() {
        let launcher = new Launcher();
        launcher.addActionProvider(new ApplicationProvider());
        launcher.addActionProvider(new CalculatorProvider());
        launcher.addActionProvider(new CurrencyExchangeProvider());
        launcher.addActionProvider(new PowerActionProvider());
        launcher.addActionProvider(new GeneratorActionProvider());
        // launcher.addActionProvider(new SystemMonitorProvider()); // TODO

        const monitors = App.get_monitors();

        let socketManager = new SocketManager();
        socketManager.startServer();

        monitors.filter(canRunOnMonitor).map(Bar);

        socketManager.showLauncherCallback(() => {
            launcher.toggle();
        });
    },
})

function canRunOnMonitor(monitor: Gdk.Monitor) {
    let connector = monitor.get_connector();
    return connector == "DP-2" || connector == "HDMI-A-2x";
}
