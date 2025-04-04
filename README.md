# Console-Log-Star

一个增强的控制台日志工具，提供样式化输出、日志记录功能和环境控制。

> console.csslog 使用方法如下：
> ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1e927fc84264ff2ae56e673d019124c~tplv-k3u1fbpfcp-watermark.image)
> 7种样式直接使用它们的下标，也可以自己自定义 例如下面
> 官方文档: http://nodejs.cn/api/console.html

## 特性

- 样式化控制台输出（支持预设样式和自定义样式）
- 可配置的日志记录功能
- 环境控制（在生产环境自动禁用所有控制台输出）
- 日志级别过滤
- 日志历史记录
- 带标签/前缀的日志输出
- 条件日志输出
- 日志导出功能
- 限流日志（防止短时间内输出过多日志）
- TypeScript 类型支持

## 安装

```bash
npm install console-log-star --save
```

## 使用方法

### 基本使用

```typescript
import Slog from 'console-log-star';

// 创建一个带默认配置的实例
const logger = new Slog();

// 使用覆盖全局console变量的方式
const console = logger.selfconsole;

// 直接使用增强的控制台
console.log('普通日志');
```

### 配置选项

```typescript
import Slog, { Config } from 'console-log-star';

const config: Config = {
  // 日志输出级别
  openLevel: 0,
  // 日志记录级别
  openRewriteLogLevel: 0,
  // 日志记录主机地址
  requestLogHost: "",
  // 日志记录回调函数
  consoleWriteLogFun: (params) => {
    // 处理日志记录
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },
  // 样式模板
  styleTemplate: "default",
  // 环境：development | production
  environment: "development"
};

const logger = new Slog(config);
const console = logger.selfconsole;
```

### 样式化输出

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 使用预设样式
console.csslog("这是一条重要消息", 0); // 使用第一个样式
console.csslog("这是一条错误消息", 1); // 使用第二个样式

// 使用内置样式
console.log("%c这是一个紫色标题", console.style.purple);
console.log("%c这是一个键", console.style.key);
console.log("%c这是一个值", console.style.value);

// 使用自定义样式
console.csslog("自定义样式", "color: green; font-size: 20px;");
```

### 日志记录

```typescript
import Slog from 'console-log-star';

const logger = new Slog({
  consoleWriteLogFun: (message) => {
    // 将日志发送到服务器或保存到本地
    console.log('记录日志:', message);
  }
});

const console = logger.selfconsole;

// 记录日志并输出到控制台
console.wlog('这是需要记录的重要信息', { userId: 123, action: 'login' });
```

### 日志级别

```typescript
import Slog, { LogLevel } from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 设置日志级别
console.logLevel = LogLevel.INFO; // 只显示INFO及以上级别的日志

// 不同级别的日志
console.debug('这条日志不会显示，因为级别低于INFO');
console.info('这条日志会显示');
console.warn('警告信息');
console.error('错误信息');
```

### 带标签的日志

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 使用标签分类日志
console.taggedLog(['用户', '登录'], '用户已登录', { userId: 123 });
console.taggedLog(['系统', '性能'], '内存使用情况', { memoryUsage: '75%' });
```

### 带前缀的日志

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 创建带前缀的日志记录器
const userLogger = console.withPrefix('[用户服务]');
const authLogger = console.withPrefix('[认证服务]');

// 使用带前缀的日志记录器
userLogger.log('用户列表已加载');
authLogger.error('认证失败', { reason: '密码错误' });
```

### 条件日志

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

const isDebug = true;
const isError = false;

// 条件输出日志
console.logIf(isDebug, '调试信息', { details: '...' }); // 会输出
console.logIf(isError, '错误信息'); // 不会输出
```

### 日志历史和导出

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 记录一些日志
console.log('应用启动');
console.info('配置加载完成');
console.warn('发现潜在问题');

// 访问日志历史
console.log('日志数量:', console.history.length);

// 导出日志为JSON格式
const jsonLogs = console.exportLogs('json');
// 或导出为文本格式
const textLogs = console.exportLogs('text');

// 将日志发送到服务器或保存到文件
fetch('/api/logs', {
  method: 'POST',
  body: jsonLogs
});

// 清除历史记录
console.clearHistory();
```

### 限流日志

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 模拟频繁事件
setInterval(() => {
  // 相同的key在1秒内只会输出一次
  console.throttledLog('heartbeat', '系统正常运行中');
}, 100);

// 不同的key会分别计时
setInterval(() => {
  console.throttledLog('performance', '内存使用:', process.memoryUsage());
}, 100);
```

### 在生产环境中禁用日志

```typescript
import Slog from 'console-log-star';

const logger = new Slog({
  environment: process.env.NODE_ENV // 根据环境变量自动设置
});

const console = logger.selfconsole;

// 在生产环境中，这些日志不会显示
console.log('调试信息');
console.warn('警告');
console.error('错误');
```

## 全局替换原生console

在某些场景下，您可能希望全局替换原生的console对象：

```typescript
import Slog from 'console-log-star';

const logger = new Slog();

// 全局替换原生console
// 注意：在某些环境中直接修改全局console可能会受到限制
window.console = logger.selfconsole;
// 或在Node.js环境中
global.console = logger.selfconsole;
```

## 可用样式

- `markedness` - 蓝色背景，白色文字
- `error` - 红色背景，白色文字
- `writeLog` - 带蓝色下划线
- `purple` - 紫色背景，白色文字
- `bigBox` - 带红色边框的大盒子
- `key` - 红色背景标签
- `value` - 绿色背景标签

## 贡献

欢迎提交 issues 和 pull requests 来帮助改进这个项目。

## 许可

ISC