import { config } from "./config";
export default class Slog {
    config: any;
    style: any;
    selfconsole: any;
    original_console: {};
    constructor(c: config);
    observe(): void;
    installWriteLog(): void;
}
