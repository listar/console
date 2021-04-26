export enum config {
  openLevel = 0,
  openWriteLogLevel = 0,
  // requestLogHost = "",
  consoleWriteLogFun = '',  // wlog  回调函数
  styleTemplate = "default",
  environment = "development"
}

export enum styleTemplate {
  default,
  markedness,
  error,
  writeLog
}

export enum styleContent {
  default = "",
  markedness = "padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: blue",
  error = "font-size:26px;border:1px solid red",
  writeLog = "font-size:20px;border-bottom:2px solid blue"
}
