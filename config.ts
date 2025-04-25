import {Config} from "./utils/config-type";

export const AppConfig: Config = {
    bar: {
        monitors: [
            {model: "DELL G2724D"},
            {model: "LG TV SSCR2-"},
        ],
        widgets: {
            datetime: {
                dateTimeFormat: "%I:%M %p - %a %b %d",
                timeFormat: "%I:%M:%S %p",
            }
        },
        enableHyprlandBlur: true,
    },
    launcher: {
        enableHyprlandBlur: true,
    }
};