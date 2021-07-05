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
    markedness = " border-radius:4px; color: #fff; background: blue; font-size: 18px;padding: 3px 0",
    error = "font-size:26px;background:red;color:#FFF; border-radius:4px;text-align: center;padding:0 6px",
    writeLog = "font-size:20px;border-bottom:2px solid blue",
    purple = "background-color: fuchsia ; color: white ; font-weight: bold ; font-size: 20px ; font-style: italic ; text-decoration: underline ; font-family: 'american typewriter' ; text-shadow: 1px 1px 3px black ;",
    bigBox = "display: inline-block ; border: 3px solid red ; border-radius: 7px ; padding: 10px ; margin: 20px ;font-size:16px",
    key = "background-color: #e0005a; color: #ffffff; font-weight: bold; padding: 4px 5px;border-radius:4px;",
    value = "background-color:#41b883; color: #ffffff; font-weight: bold; padding: 4px 5px; border-radius:4px;"
}
