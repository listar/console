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
    styleContent["default"] = "";
    styleContent["markedness"] = "padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: blue";
    styleContent["error"] = "font-size:26px;border:1px solid red";
    styleContent["writeLog"] = "font-size:20px;border-bottom:2px solid blue";
})(styleContent || (styleContent = {}));
