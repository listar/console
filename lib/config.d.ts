export interface Config {
    openLevel?: number;
    openRewriteLogLevel?: number;
    requestLogHost?: string;
    consoleWriteLogFun?: ((...args: any[]) => void) | string;
    styleTemplate?: StyleTemplate;
    environment?: Environment;
}
export declare enum StyleTemplate {
    Default = "default",
    Markedness = "markedness",
    Error = "error",
    WriteLog = "writeLog"
}
export type Environment = "development" | "production";
export declare const defaultConfig: Config;
export declare const styleContent: {
    markedness: string;
    error: string;
    writeLog: string;
    purple: string;
    bigBox: string;
    key: string;
    value: string;
};
