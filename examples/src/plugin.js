import Slog from "../../lib/index";

let slog = new Slog({
  openLevel: 1, // console.log 输出级别
  openWriteLogLevel: 1, // 推送日志级别
  consoleWriteLogFun: (...data)=> {
    console.log("------request  to do write log-------]", data);
  }
});
var console = slog.selfconsole;

console.log("hello world");

console.log('hello');

console.log(
  "%c hello world  %c error   %c 下划线  ",
  slog.style.markedness,
  slog.style.error,
  slog.style.writeLog
);
console.error("test error", "test error1");

console.warn('hello  warn')

console.info("hello  table");
console.wlog('write log ', 'write log 1')
