import { config, styleContent } from "./config";

export default class Slog {

  // 配置
  public config: any = {};
  // console-log-star
  public selfconsole: any = {};
  // 原生console
  public original_console = typeof console !== "undefined" ? console : {};

  constructor(c: config) {
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
    this.observe();
    this.setupWriteLog();
    this.consoleStyle()
    this.setupCsslog()
  }

  observe() {
    // let _this = this;
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
        return Reflect.get(obj, prop, value);
      },
    });

  }

  setupWriteLog() {
    this.selfconsole.wlog = (...param: any) => {
      // todo write  log
      if (typeof this.config.consoleWriteLogFun === "function"){
        this.config.consoleWriteLogFun.apply(this, param)
      }

      this.selfconsole.log(param);
    };
  }

  consoleStyle(){
    this.selfconsole.style = styleContent;
  }

  setupCsslog(){
    this.selfconsole.csslog  = ( text: string, ...styleArr:any) => {
      const styleArrKeys: Array<string> = Object.keys(styleContent)
      const styleData: any = []
      styleArr.forEach((element: Number| String) => {
        if(typeof element === "number"){
          let index = styleArrKeys[element]? styleArrKeys[element] : "red";
          styleData.push(this.selfconsole.style[index])
        }else{
          styleData.push(element)
        }
      });
      this.selfconsole.log(text, ...styleData)
    }

  }
}
