import { config } from "./config";
export default class Slog {
    config: any;
    selfconsole: any;
    original_console: {};
    constructor(c: config);
    observe(): void;
    setupWriteLog(): void;
    consoleStyle(): void;
    setupCsslog(): void;
}
