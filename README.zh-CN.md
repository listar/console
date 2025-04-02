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

### 样式详解

Console-Log-Star提供了两种使用样式的方式：索引样式和命名样式。

#### 索引样式 (0-6)

可以通过数字索引快速使用7种预设样式：

```typescript
// 红色粗体
console.csslog("样式0", 0);  // color: red; font-weight: bold;

// 蓝色粗体
console.csslog("样式1", 1);  // color: blue; font-weight: bold;

// 绿色粗体
console.csslog("样式2", 2);  // color: green; font-weight: bold;

// 橙色粗体
console.csslog("样式3", 3);  // color: orange; font-weight: bold;

// 紫色粗体
console.csslog("样式4", 4);  // color: purple; font-weight: bold;

// 蓝绿色粗体
console.csslog("样式5", 5);  // color: teal; font-weight: bold;

// 棕色粗体
console.csslog("样式6", 6);  // color: brown; font-weight: bold;
```

#### 命名样式

内置的命名样式可以通过`console.style`对象访问：

```typescript
// 紫色粗体，大号字体
console.log("%c标题样式", console.style.purple);  // color: purple; font-weight: bold; font-size: 16px;

// 蓝色粗体
console.log("%c键样式", console.style.key);  // color: blue; font-weight: bold;

// 绿色普通
console.log("%c值样式", console.style.value);  // color: green; font-weight: normal;

// 带背景和边框的标记样式
console.log("%c标记样式", console.style.markedness);  // 带特殊标记的样式

// 红色错误样式
console.log("%c错误提示", console.style.error);  // 错误提示样式

// 写日志样式
console.log("%c日志记录", console.style.writeLog);  // 日志记录样式

// 大盒子样式
console.log("%c大盒子样式", console.style.bigBox);  // 带边框的大盒子样式
```

#### 自定义样式

您可以使用任何有效的CSS样式创建自定义样式：

```typescript
// 直接使用自定义样式
console.csslog("红色背景样式", "color: white; background: red; padding: 2px 5px; border-radius: 3px;");

// 将自定义样式添加到style对象
console.style.success = "color: green; font-weight: bold; background: #e8f5e9; padding: 2px 5px; border-radius: 3px;";
console.style.warning = "color: orange; font-weight: bold; background: #fff3e0; padding: 2px 5px; border-radius: 3px;";
console.style.failure = "color: red; font-weight: bold; background: #ffebee; padding: 2px 5px; border-radius: 3px;";

// 使用自定义样式
console.log("%c成功", console.style.success);
console.log("%c警告", console.style.warning);
console.log("%c失败", console.style.failure);
```

样式支持所有CSS属性，如：
- `color`: 文本颜色
- `background`: 背景颜色
- `font-size`: 字体大小
- `font-weight`: 字体粗细
- `padding`: 内边距
- `margin`: 外边距
- `border`: 边框
- `border-radius`: 圆角
- `text-decoration`: 文本装饰
- `text-shadow`: 文本阴影

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
global.console = logger.selfconsole;

// 现在所有console调用都使用增强版本
console.log('这是增强版的console');
```

## 最佳实践

### 按模块使用前缀

在大型应用中，推荐为每个模块创建带前缀的日志记录器：

```typescript
// user-service.ts
import { console } from './logger';

const userLogger = console.withPrefix('[用户服务]');

export class UserService {
  getUsers() {
    userLogger.log('正在获取用户列表...');
    // ...
  }
}

// auth-service.ts
import { console } from './logger';

const authLogger = console.withPrefix('[认证服务]');

export class AuthService {
  login(username, password) {
    authLogger.log(`用户 ${username} 尝试登录`);
    // ...
  }
}
```

### 使用标签进行日志分类

使用标签可以使日志更易于搜索和过滤：

```typescript
function processOrder(order) {
  console.taggedLog(['订单', '处理'], `开始处理订单 ${order.id}`);
  
  try {
    // 处理订单...
    console.taggedLog(['订单', '成功'], `订单 ${order.id} 处理成功`);
  } catch (error) {
    console.taggedLog(['订单', '错误'], `订单 ${order.id} 处理失败`, error);
  }
}
```

### 日志级别最佳实践

- **DEBUG**：详细的开发信息，辅助调试
- **INFO**：常规操作信息，应用正常工作的状态
- **WARN**：可能的问题或即将发生的问题
- **ERROR**：错误和异常情况
- **NONE**：禁用所有日志

## 高级功能

### 自定义样式模板

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 添加自定义样式
console.style.success = "color: green; font-weight: bold; background: #e8f5e9; padding: 2px 5px; border-radius: 3px;";
console.style.failure = "color: red; font-weight: bold; background: #ffebee; padding: 2px 5px; border-radius: 3px;";

// 使用自定义样式
console.log("%c操作成功", console.style.success);
console.log("%c操作失败", console.style.failure);
```

### 性能测试

```typescript
import Slog from 'console-log-star';

const logger = new Slog();
const console = logger.selfconsole;

// 测量代码执行时间
console.time('操作耗时');

// 执行一些耗时操作
for (let i = 0; i < 1000000; i++) {
  // ...
}

// 输出执行时间
console.timeEnd('操作耗时'); // 输出：操作耗时: 123ms
```

## 版本历史

- **v1.3.0**：添加日志级别、历史、标签、前缀、条件和限流功能
- **v1.2.8**：增加更多样式选项和格式化功能
- **v1.2.0**：添加环境控制功能
- **v1.0.0**：首次发布，提供基本的样式化控制台和日志记录

## 许可证

ISC 