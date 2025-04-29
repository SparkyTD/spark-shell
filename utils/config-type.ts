type MonitorFilter = {
    connector?: string,
    model?: string,
};

type WidgetsConfig = {
    datetime: {
        dateTimeFormat: string,
        timeFormat: string,
    },
    awb?: {
        awb: string,
        apiUrl: string,
        titleJsonEval: (data: any) => string,
        tooltipJsonEval: (data: any) => string,
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
    },
    defaults: {
        terminal: string,
    }
};