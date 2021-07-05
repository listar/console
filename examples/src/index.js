
import consolelog  from "console-log-star";
// import consolelog from "../../index";


let slog = new consolelog({
  consoleWriteLogFun: (...data) => {
    console.log("------request  to do write log-------]", data);
  },
  environment: "development",
});

var console = slog.selfconsole;



// 使用
console.log(
  "%c hello world  %c error   %c 下划线   %c 紫色   %c  大盒子  %c 红色  %c value",
  console.style.markedness,
  console.style.error,
  console.style.writeLog,
  console.style.purple,
  console.style.bigBox,
  console.style.key,
  console.style.value
);
console.error("test error", "test error1");

console.warn("hello  warn");
console.trace("展示");

console.wlog("write log ", "write log 1");


// csslog 使用
console.csslog("%chello%cworld", 5, 6);
console.csslog("%chello%cworld %c 小明", 0, 1, 5);
console.csslog("%chello%cworld", 0, 2);
console.csslog("%chello%cworld", 0, 0);
console.csslog("%chello%cworld", 5, 6);
console.csslog("%chello world", 1);
console.csslog("%chello %cworld", 5, "background:red;color:#FFF");


//创建一个组
console.group("%c组内容输出", console.style.key);
//分组输出
console.log("我是组里面的内容1");
console.log("我是组里面的内容2");
console.log("我是组里面的内容3");
//结束
console.groupEnd();


console.time("100-elements");
for (let i = 0; i < 100; i++) {}
console.timeEnd("100-elements");