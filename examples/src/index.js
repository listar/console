import consolelog  from "console-log-star/index";
// import Slog from "../../index";


let slog = new consolelog({
  consoleWriteLogFun: (...data) => {
    console.log("------request  to do write log-------]", data);
  },
  environment: "development",
});


var console = slog.selfconsole;



console.log(
  "%c hello world  %c error   %c 下划线  ",
  slog.style.markedness,
  slog.style.error,
  slog.style.writeLog
);
console.error("test error", "test error1");

console.warn("hello  warn");
console.trace("展示");

console.wlog("write log ", "write log 1");


console.time("100-elements");
for (let i = 0; i < 100; i++) {}
console.timeEnd("100-elements");