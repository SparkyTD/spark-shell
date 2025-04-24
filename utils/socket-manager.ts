import {Gio, GLib, exec} from "astal"

export default class SocketManager {
    private isServerRunning = false;
    private _showLauncherCallback?: Function;

    public startServer() {
        if (this.isServerRunning) {
            return;
        }

        const socketPath = GLib.build_filenamev([GLib.get_user_runtime_dir(), "astal-shell.sock"]);
        const file = Gio.File.new_for_path(socketPath);
        if (file.query_exists(null))
            exec(["rm", socketPath]);

        const address = new Gio.UnixSocketAddress({
            path: socketPath,
        });

        const socketService = new Gio.SocketService();
        socketService.add_address(
            address,
            Gio.SocketType.STREAM,
            Gio.SocketProtocol.DEFAULT,
            null
        );
        socketService.connect('incoming', this.onIncoming.bind(this));
        socketService.start();

        this.isServerRunning = true;
    }

    public showLauncherCallback(callback: Function) {
        this._showLauncherCallback = callback;
    }

    onIncoming(service: Gio.SocketService, connection: Gio.UnixConnection) {
        const inputStream = connection.get_input_stream();
        const dataStream = new Gio.DataInputStream({base_stream: inputStream});
        this.readFromClient(dataStream, connection);
    }

    readFromClient(dataStream: Gio.DataInputStream, connection: Gio.UnixConnection) {
        dataStream.read_line_async(GLib.PRIORITY_DEFAULT, null, (stream, res) => {
            try {
                const [line, _] = stream!.read_line_finish_utf8(res);
                let argv = line?.split(' ')!;
                if (argv.length > 0) {
                    this.processSocketCommand(argv[0], argv.slice(1));
                }
                connection.close(null);
            } catch (e) {
                console.error(e);
            }
        });
    }

    processSocketCommand(command: string, args: string[]) {
        if (command == "launcher" && !!this._showLauncherCallback) {
            this._showLauncherCallback();
        }
    }
}