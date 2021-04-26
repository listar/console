export declare enum config {
    openLevel = 0,
    openWriteLogLevel = 0,
    consoleWriteLogFun = "",
    styleTemplate = "default",
    environment = "development"
}
export declare enum styleTemplate {
    default = 0,
    markedness = 1,
    error = 2,
    writeLog = 3
}
export declare enum styleContent {
    default = "",
    markedness = "padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: blue",
    error = "font-size:26px;border:1px solid red",
    writeLog = "font-size:20px;border-bottom:2px solid blue"
}
