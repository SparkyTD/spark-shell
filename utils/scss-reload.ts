import {Gio, exec, monitorFile} from "astal";
import {App} from "astal/gtk4"

export default class HotReloadStylesManager {
    private main_input_file: Gio.File;
    private input_dir: Gio.File;
    private readonly output_path: string;
    private debounce_number: number;

    constructor(main_style_path: string) {
        this.main_input_file = Gio.File.new_for_path(main_style_path);
        this.input_dir = this.main_input_file.get_parent()!;
        this.output_path = "/tmp/astal.css";
        this.debounce_number = 0;
    }

    public watchInputFiles() {
        this.compileScss();

        monitorFile(this.input_dir.get_path()!, () => {
            let ticket = ++this.debounce_number;
            setTimeout(() => {
                if (this.debounce_number != ticket) {
                    return;
                }

                this.compileScss();
                App.reset_css();
                App.apply_css(this.getOutputFile());

            }, 100);
        });
    }

    public getOutputFile(): string {
        return this.output_path;
    }

    compileScss() {
        const error = exec(["sass", this.main_input_file.get_path()!, this.output_path]);
        if (error) {
            console.error(`Failed to compile scss: ${error}`);
        }
    }
}