import {GLib} from "astal";

export default function initPRNG() {
    (window as any)["crypto"] = {
        getRandomValues: <T extends ArrayBufferView | null>(array: T) => {
            if (array === null) {
                return null as T;
            }

            const byteLength = array.byteLength;
            const targetView = new Uint8Array(array.buffer, array.byteOffset, byteLength);

            for (let i = 0; i < byteLength; i++) {
                targetView[i] = GLib.random_int() % 255;
            }

            return array;
        }
    };
}