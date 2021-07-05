# console

console二次封装、console进行日志记录、console 快捷样式输出、**配置一键关闭所有console输出**

  
## 组件功能：
  + console原生上面所有功能
  + 组件实现配置，一键关闭所有console输出
  + 新增wlog方法进行输出控制台并可以配置这个函数回调（进行日志记录等）
  + console输出几种样式的输出log 

> console.csslog 使用方法如下：
> ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1e927fc84264ff2ae56e673d019124c~tplv-k3u1fbpfcp-watermark.image)
> 7种样式直接使用它们的下标，也可以自己自定义 例如下面

```js
// csslog 使用
console.csslog("%chello%cworld", 5, 6);
console.csslog("%chello%cworld %c小明", 0, 1, 5);
console.csslog("%chello%cworld", 0, 2);
console.csslog("%chello%cworld", 0, 0);
console.csslog("%chello%cworld", 5, 6);
console.csslog("%chello world", 1);
console.csslog("%chello %cworld", 5, "background:red;color:#FFF");
```

## 使用方式
```JavaScript

import consolelog  from "console-log-star";
let slog = new consolelog({
  consoleWriteLogFun: (...data) => {   // .wlog 输出回调函数
    console.log("------request  to do write log-------]", data);
  },
  environment: "development",  // 控制console输出  非development  console功能失效
});
// 全局声明变量 console
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

```


## console输出支持占位符说明

+ %s - String 将用于转换除 BigInt、 Object 和 -0 外的所有值。BigInt 值将用 n 表示，而没有用户定义 toString 函数的对象使用带有选项 { depth: 0, colors: false, compact: 3 } 的 util.inspect() 进行检查。

+ %d - Number 将用于转换除 BigInt 和 Symbol 之外的所有值。

+ %i - parseInt(value, 10) 用于除 BigInt 和 Symbol 之外的所有值。

+ %f - parseFloat(value) 用于除 BigInt 和 Symbol 之外的所有值。

+ %j - JSON。如果参数包含循环引用，则替换为字符串 '[Circular]'。

+ %o - Object。具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于带有选项 { showHidden: true, showProxy: true } 的 util.inspect()。 这将显示完整对象，包括非可枚举属性和代理。

+ %O - Object。具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于 util.inspect() 但没有选项。 这将显示完整对象，不包括非可枚举属性和代理。

+ %c - CSS。该说明符会被忽略，将会跳过任何传入的 CSS。

+ %% - 单个百分号（'%'）。这不会消耗参数。
    返回: <string> 格式化的字符串。

## 官方文档

http://nodejs.cn/api/console.html