// Node.js示例
// 运行方式: node --experimental-modules node-example.js

import Slog, { LogLevel } from '../index.js';

// 创建一个实例
const logger = new Slog({
  consoleWriteLogFun: (...data) => {
    // 将日志写入文件或发送到服务器
    console.log('日志记录:', data);
  },
  environment: 'development', // 设置为production会禁用所有控制台输出
});

// 获取增强的控制台并覆盖全局console
const console = logger.selfconsole;

console.log('===== 基本日志功能 =====');
console.log('这是一条普通日志');
console.error('这是一条错误日志');
console.warn('这是一条警告日志');

console.log('\n===== 日志级别 =====');
console.debug('这是一条DEBUG级别的日志');
console.info('这是一条INFO级别的日志');

// 修改日志级别
console.log('\n将日志级别改为 INFO');
console.logLevel = LogLevel.INFO;
console.debug('这条DEBUG日志不会显示');
console.info('这条INFO日志会显示');

console.log('\n===== 带标签的日志 =====');
console.taggedLog(['用户', '认证'], '用户认证成功', { userId: 123 });
console.taggedLog(['系统', '性能'], '内存使用情况', { memoryUsage: process.memoryUsage() });

console.log('\n===== 带前缀的日志 =====');
const userLogger = console.withPrefix('[用户服务]');
const authLogger = console.withPrefix('[认证服务]');

userLogger.log('用户列表已加载');
authLogger.error('认证失败', { reason: '密码错误' });

console.log('\n===== 条件日志 =====');
const isDebug = true;
const isProduction = false;

console.logIf(isDebug, '调试详情:', { serverStatus: 'running' });
console.logIf(isProduction, '这条日志不会显示');

console.log('\n===== 写入日志 =====');
console.wlog('这条日志将会被记录', { action: 'test', timestamp: new Date() });

console.log('\n===== 限流日志 =====');
for (let i = 0; i < 5; i++) {
  // 相同key的多次调用在短时间内只会输出一次
  console.throttledLog('test', `尝试 ${i + 1}`);
}

// 使用不同的key会分别计时
console.throttledLog('another-key', '这条日志会显示，因为key不同');

console.log('\n===== 日志历史 =====');
console.log(`当前记录的日志数量: ${console.history.length}`);

// 添加样式测试部分
console.log('\n===== 样式测试 =====');

// 测试索引样式 (0-6)
console.log('--- 索引样式 (0-6) ---');
for (let i = 0; i < 7; i++) {
  console.csslog(`样式 ${i}: 这是使用样式索引 ${i} 的文本`, i);
}

// 测试命名样式
console.log('\n--- 命名样式 ---');
console.log("%c紫色样式 (purple)", console.style.purple);
console.log("%c键样式 (key)", console.style.key);
console.log("%c值样式 (value)", console.style.value);
console.log("%c标记样式 (markedness)", console.style.markedness);
console.log("%c错误样式 (error)", console.style.error);
console.log("%c写日志样式 (writeLog)", console.style.writeLog);
console.log("%c大盒子样式 (bigBox)", console.style.bigBox);

// 测试自定义样式
console.log('\n--- 自定义样式 ---');
console.csslog("自定义红色样式", "color: red; font-size: 16px; background: #ffeeee; padding: 2px 5px; border-radius: 3px;");
console.csslog("自定义绿色样式", "color: green; font-size: 16px; background: #eeffee; padding: 2px 5px; border-radius: 3px;");
console.csslog("自定义蓝色样式", "color: blue; font-size: 16px; background: #eeeeff; padding: 2px 5px; border-radius: 3px;");

// 添加自定义样式到style对象中
console.style.success = "color: green; font-weight: bold; background: #e8f5e9; padding: 2px 5px; border-radius: 3px;";
console.style.warning = "color: orange; font-weight: bold; background: #fff3e0; padding: 2px 5px; border-radius: 3px;";
console.style.failure = "color: red; font-weight: bold; background: #ffebee; padding: 2px 5px; border-radius: 3px;";

console.log('\n--- 添加到style对象的自定义样式 ---');
console.log("%c成功样式 (success)", console.style.success);
console.log("%c警告样式 (warning)", console.style.warning);
console.log("%c失败样式 (failure)", console.style.failure);

console.log('\n===== 导出日志 =====');
console.log('文本格式的日志:');
console.log(console.exportLogs('text'));

console.log('\nJSON格式的日志(部分):');
const jsonLogs = console.exportLogs('json');
console.log(jsonLogs.substring(0, 300) + '...');

// 表格输出
console.log('\n===== 表格输出 =====');
console.table([
  { 名称: '产品A', 价格: 100, 库存: 50 },
  { 名称: '产品B', 价格: 200, 库存: 30 },
  { 名称: '产品C', 价格: 300, 库存: 20 }
]);

// 分组输出
console.log('\n===== 分组输出 =====');
console.group('分组测试');
console.log('分组内容1');
console.log('分组内容2');
console.groupEnd();

// 性能测试
console.log('\n===== 性能测试 =====');
console.time('性能测试');
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}
console.timeEnd('性能测试');

console.log('测试完成，总和:', sum);

// 清除历史
console.log('\n清除日志历史');
console.clearHistory();
console.log(`清除后的日志数量: ${console.history.length}`); 