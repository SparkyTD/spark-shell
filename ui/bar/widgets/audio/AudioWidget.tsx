import {bind} from "astal";
import {Gtk, Gdk} from "astal/gtk4";
import Wp from "gi://AstalWp";
import AudioPopup from "./AudioPopup";

function setupIconController(image: Gtk.Image, endpoint: Wp.Endpoint) {
    let scrollController = new Gtk.EventControllerScroll({flags: Gtk.EventControllerScrollFlags.VERTICAL});
    scrollController.connect('scroll', (_e, _dx, dy) => {
        let direction = -dy > 0 ? 1 : -1;
        let increment = direction * 0.01;
        endpoint.volume = Math.max(0, Math.min(1, endpoint.volume + increment));
    });
    image.add_controller(scrollController);

    let clickController = new Gtk.GestureClick({button: 2});
    clickController.connect('pressed', () => {
        endpoint.mute = !endpoint.mute;
    });
    image.add_controller(clickController);
}

export default function AudioWidget() {
    const audio = Wp.get_default()!
    const speaker = audio.audio.defaultSpeaker!;
    const microphone = audio.audio.defaultMicrophone!;

    return <menubutton cssClasses={["widget-audio", "bar-button"]}
                       cursor={Gdk.Cursor.new_from_name("pointer", null)}>
        <box>
            <image iconName={bind(speaker, "volumeIcon")} setup={self => setupIconController(self, speaker)}
                   tooltipText={bind(speaker, "description")}/>
            <image iconName={bind(microphone, "volumeIcon")} setup={self => setupIconController(self, microphone)}
                   tooltipText={bind(microphone, "description")}/>
        </box>

        <AudioPopup audio={audio.audio} speaker={speaker} microphone={microphone}/>
    </menubutton>
}