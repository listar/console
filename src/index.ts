import { config, styleContent } from "./config";

export default class Slog {
  // [x: string]: any;
  public config: any = {};
  public style: any = {};
  public selfconsole: any;
  public original_console = typeof console !== "undefined" ? console : {};
  constructor(c: config) {
    // super();
    Object.assign(
      this.config,
      {
        openLevel: 0, // console.log 输出级别
        openRewriteLogLevel: 0, // 推送日志级别
        requestLogHost: "", // 推送日志host
        styleTemplate: "default", // console.log 输出样式模板
        environment: "development",
      },
      c
    );
    this.style = styleContent;
    this.observe();
    this.installWriteLog();
  }

  observe() {
    let _this = this;
    if (this.config.environment !== "development") {
      let _c: any = {};
      Object.keys(console).forEach((item: string) => {
        _c[item] = () => {};
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
    this.selfconsole.wlog = (...param: any) => {
      // todo write  log
      if (typeof this.config.consoleWriteLogFun === "function"){
        this.config.consoleWriteLogFun.apply(this, param)
      }

      this.selfconsole.log(param);
    };
  }

  // log(...params: any) {
  //   if (typeof console !== "object") return;
  //   let func: string = "log";
  //   let paramsFrist: string = params[0];
  //   if (Object.keys(console).includes(paramsFrist)) {
  //     func = paramsFrist;
  //     params.shift();
  //   }
  //   if (this.config.environment !== "development") return;
  //   //   if (!wx.env.isDebug) return;
  //   // eval(`console.${func}`).apply(console, [...params]);
  //   (<any>console)[func].apply(console, [...params]);
  // }
}
