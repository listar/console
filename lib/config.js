export var config;
(function (config) {
    config[config["openLevel"] = 0] = "openLevel";
    config[config["openWriteLogLevel"] = 0] = "openWriteLogLevel";
    // requestLogHost = "",
    config["consoleWriteLogFun"] = "";
    config["styleTemplate"] = "default";
    config["environment"] = "development";
})(config || (config = {}));
export var styleTemplate;
(function (styleTemplate) {
    styleTemplate[styleTemplate["default"] = 0] = "default";
    styleTemplate[styleTemplate["markedness"] = 1] = "markedness";
    styleTemplate[styleTemplate["error"] = 2] = "error";
    styleTemplate[styleTemplate["writeLog"] = 3] = "writeLog";
})(styleTemplate || (styleTemplate = {}));
export var styleContent;
(function (styleContent) {
    styleContent["markedness"] = " border-radius:4px; color: #fff; background: blue; font-size: 18px;padding: 3px 0";
    styleContent["error"] = "font-size:26px;background:red;color:#FFF; border-radius:4px;text-align: center;padding:0 6px";
    styleContent["writeLog"] = "font-size:20px;border-bottom:2px solid blue";
    styleContent["purple"] = "background-color: fuchsia ; color: white ; font-weight: bold ; font-size: 20px ; font-style: italic ; text-decoration: underline ; font-family: 'american typewriter' ; text-shadow: 1px 1px 3px black ;";
    styleContent["bigBox"] = "display: inline-block ; border: 3px solid red ; border-radius: 7px ; padding: 10px ; margin: 20px ;font-size:16px";
    styleContent["key"] = "background-color: #e0005a; color: #ffffff; font-weight: bold; padding: 4px 5px;border-radius:4px;";
    styleContent["value"] = "background-color:#41b883; color: #ffffff; font-weight: bold; padding: 4px 5px; border-radius:4px;";
})(styleContent || (styleContent = {}));
