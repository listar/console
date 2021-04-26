import { styleContent } from "./config";
export default class Slog {
    constructor(c) {
        // [x: string]: any;
        this.config = {};
        this.style = {};
        this.original_console = typeof console !== "undefined" ? console : {};
        // super();
        Object.assign(this.config, {
            openLevel: 0,
            openRewriteLogLevel: 0,
            requestLogHost: "",
            styleTemplate: "default",
            environment: "development",
        }, c);
        this.style = styleContent;
        this.observe();
        this.installWriteLog();
    }
    observe() {
        let _this = this;
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
                // obj.log("console--log--get", obj, prop, value);
                // let event = new CustomEvent(prop, {
                //   detail: value,
                // });
                // _this.dispatchEvent(event);
                // if (_this.config.environment){
                //   return;
                // }
                // obj.log(...arguments);
                // var args = Array.prototype.slice.apply(arguments);
                // obj.log(args);
                return Reflect.get(obj, prop, value);
            },
        });
    }
    installWriteLog() {
        this.selfconsole.wlog = (...param) => {
            // todo write  log
            if (typeof this.config.consoleWriteLogFun === "function") {
                this.config.consoleWriteLogFun.apply(this, param);
            }
            this.selfconsole.log(param);
        };
    }
}
