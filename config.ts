import {Config} from "./utils/config-type";

export const AppConfig: Config = {
    bar: {
        monitors: [
            {model: "DELL G2724D"},
            {model: "LG TV SSCR2"},
        ],
        widgets: {
            time: {format: "%I:%M %p - %a %b %d"}
        },
        enableHyprlandBlur: true,
    },
    launcher: {
        enableHyprlandBlur: true,
    }
};