import { styleContent } from "./config";
export default class Slog {
    constructor(c) {
        // 配置
        this.config = {};
        // console-log-star
        this.selfconsole = {};
        // 原生console
        this.original_console = typeof console !== "undefined" ? console : {};
        Object.assign(this.config, {
            openLevel: 0,
            openRewriteLogLevel: 0,
            requestLogHost: "",
            styleTemplate: "default",
            environment: "development",
        }, c);
        this.observe();
        this.setupWriteLog();
        this.consoleStyle();
        this.setupCsslog();
    }
    observe() {
        // let _this = this;
        if (this.config.environment !== "development") {
            let _c = {};
            Object.keys(console).forEach((item) => {
                _c[item] = () => { };
            });
            this.selfconsole = _c;
            return;
        }
        this.selfconsole = new Proxy(console, {
            get(obj, prop, value) {
                return Reflect.get(obj, prop, value);
            },
        });
    }
    setupWriteLog() {
        this.selfconsole.wlog = (...param) => {
            // todo write  log
            if (typeof this.config.consoleWriteLogFun === "function") {
                this.config.consoleWriteLogFun.apply(this, param);
            }
            this.selfconsole.log(param);
        };
    }
    consoleStyle() {
        this.selfconsole.style = styleContent;
    }
    setupCsslog() {
        this.selfconsole.csslog = (text, ...styleArr) => {
            const styleArrKeys = Object.keys(styleContent);
            const styleData = [];
            styleArr.forEach((element) => {
                if (typeof element === "number") {
                    let index = styleArrKeys[element] ? styleArrKeys[element] : "red";
                    styleData.push(this.selfconsole.style[index]);
                }
                else {
                    styleData.push(element);
                }
            });
            this.selfconsole.log(text, ...styleData);
        };
    }
}
