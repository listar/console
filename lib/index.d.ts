export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    tags?: string[];
    prefix?: string;
}
export interface Config {
    openLevel?: number;
    openRewriteLogLevel?: number;
    requestLogHost?: string;
    consoleWriteLogFun?: Function;
    styleTemplate?: string;
    environment?: string;
}
export declare class SlogConsole {
    private _logLevel;
    private _history;
    private _throttleMap;
    private _throttleInterval;
    private _consoleWriteLogFun;
    private _environment;
    constructor(config?: Config);
    style: {
        [key: string]: string;
    };
    get selfconsole(): SlogConsole;
    get logLevel(): LogLevel;
    set logLevel(level: LogLevel);
    private shouldLog;
    get history(): LogEntry[];
    private addToHistory;
    clearHistory(): void;
    exportLogs(format?: 'json' | 'text'): string;
    taggedLog(tags: string[], message: string, ...args: any[]): void;
    withPrefix(prefix: string): SlogConsole;
    logIf(condition: boolean, message: string, ...args: any[]): void;
    throttledLog(key: string, message: string, ...args: any[]): void;
    wlog(message: string, ...args: any[]): void;
    csslog(message: string, style: string | number): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    log(message: string, ...args: any[]): void;
    table(data: any, columns?: string[]): void;
    group(label: string): void;
    groupEnd(): void;
    time(label: string): void;
    timeEnd(label: string): void;
}
export default class Slog {
    private _console;
    constructor(config?: Config);
    get selfconsole(): SlogConsole;
}
export {};
