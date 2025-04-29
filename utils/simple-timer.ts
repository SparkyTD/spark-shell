import {GLib} from "astal";

export default class SimpleTimer {
    private totalStartTimeMillis: number;
    private startTimeMillis: number;

    private constructor() {
        this.totalStartTimeMillis = GLib.get_monotonic_time() / 1000;
        this.startTimeMillis = this.totalStartTimeMillis;
    }

    static start(): SimpleTimer {
        return new SimpleTimer();
    }

    print(label: string): void {
        let endTimeMillis = GLib.get_monotonic_time() / 1000;
        let elapsed = endTimeMillis - this.startTimeMillis;
        console.log("[SimpleTimer]", label, "took", `${elapsed.toFixed(2)}ms`);
    }

    printTotal() {
        let endTimeMillis = GLib.get_monotonic_time() / 1000;
        let elapsed = endTimeMillis - this.totalStartTimeMillis;
        console.log("[SimpleTimer]", "Total elapsed time:", `${elapsed.toFixed(2)}ms`);
    }

    restart() {
        this.startTimeMillis = GLib.get_monotonic_time() / 1000;
    }
}