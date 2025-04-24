import {Gtk} from "astal/gtk4";

type Params = {
    orientation?: 'horizontal' | 'vertical'
}

export default function Separator({orientation = 'vertical'}: Params) {
    return <Gtk.Box cssClasses={["widget-separator", orientation]}></Gtk.Box>
}