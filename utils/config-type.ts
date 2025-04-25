type MonitorFilter = {
    connector?: string,
    model?: string,
};

type WidgetsConfig = {
    datetime: {
        dateTimeFormat: string,
        timeFormat: string,
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