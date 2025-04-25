type MonitorFilter = {
    connector?: string,
    model?: string,
};

type WidgetsConfig = {
    time: {
        format: string,
    }
};

export type Config = {
    bar: {
        monitors: MonitorFilter[],
        widgets: WidgetsConfig,
        enableHyprlandBlur: boolean,
    },
    launcher: {
        enableHyprlandBlur: boolean,
    }
};