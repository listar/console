# console
console 二次封装  console 日志记录



## 组件说明

    proxy console  方法，通过声明全局变量
    var console = slog.selfconsole; 进行使用console，
    有console的所有功能，

    组件功能：
    1.组件实现一键关闭console输出
    2.新增wlog方法进行输出控制台并可以配置这个函数回调（进行日志记录等）
    3.console输出几种样式的枚举变量


## 使用方式
```JavaScript
import consolelog  from "console-log-star/index";

let slog = new consolelog({
  consoleWriteLogFun: (...data) => {   // .wlog 输出回调函数
    console.log("------request  to do write log-------]", data);
  },
  environment: "development",  // 控制console输出  非development  console功能失效
});
var console = slog.selfconsole;
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