import {Binding, bind} from "astal";
import {Gtk} from "astal/gtk4";
import Wp from "gi://AstalWp";
import {Gdk} from "astal/gtk4";
import Separator from "../../Separator";
import {truncateTextMiddle} from "../../../../utils/text-utils";

type Params = {
    endpoint: Wp.Endpoint,
    allEndpoints?: Binding<Wp.Endpoint[]>,
    type: 'speaker' | 'microphone',
}

function EndpointVolumeControl({endpoint}: Params) {
    return <box orientation={Gtk.Orientation.VERTICAL}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <label tooltipText={bind(endpoint, 'description')}>
                {bind(endpoint, 'description').as(v => truncateTextMiddle(v, 32))}
            </label>
            <box hexpand={true}/>
            <button onClicked={() => {
                endpoint.set_mute(!endpoint.mute);
            }} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                <image iconName={bind(endpoint, "volumeIcon")} halign={Gtk.Align.END}/>
            </button>
        </box>
        <slider
            sensitive={bind(endpoint, 'mute').as(b => !b)}
            value={bind(endpoint, "volume")}
            onChangeValue={({value}) => {
                endpoint.volume = value;
            }}/>
    </box>
}

function EndpointSelector({allEndpoints}: Params) {
    return <box orientation={Gtk.Orientation.VERTICAL}>
        {allEndpoints?.as((endpoints) => {
            return endpoints.map((endpoint) => {
                return <button
                    halign={Gtk.Align.START}
                    tooltipText={bind(endpoint, 'description')}
                    cssClasses={bind(endpoint, 'isDefault').as(d => ["endpoint", d ? "default" : ""])}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    onClicked={() => {
                        endpoint.set_is_default(true);
                    }}>
                    <label>
                        {bind(endpoint, 'description').as(v => truncateTextMiddle(v, 48))}
                    </label>
                </button>
            })
        })}
    </box>
}

type PopupParams = {
    audio: Wp.Audio,
    speaker: Wp.Endpoint,
    microphone: Wp.Endpoint,
}

export default function AudioPopup({audio, speaker, microphone}: PopupParams) {

    return <popover>
        <box widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <label cssClasses={["title"]} halign={Gtk.Align.START}>Volume</label>
            <EndpointVolumeControl endpoint={speaker} type="speaker"/>
            <EndpointVolumeControl endpoint={microphone} type="microphone"/>

            <Separator orientation={'horizontal'}/>

            <label cssClasses={["title"]} halign={Gtk.Align.START}>Playback Devices</label>
            <EndpointSelector endpoint={speaker}
                              allEndpoints={bind(audio, 'speakers')}
                              type={'speaker'}/>

            <Separator orientation={'horizontal'}/>

            <label cssClasses={["title"]} halign={Gtk.Align.START}>Input Devices</label>
            <EndpointSelector endpoint={microphone}
                              allEndpoints={bind(audio, 'microphones')}
                              type={'microphone'}/>
        </box>
    </popover>
}