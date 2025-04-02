// 样式使用示例
// 运行方式: node --experimental-modules examples/style-example.js

import Slog from '../index.js';

// 创建一个实例
const logger = new Slog({
  environment: 'development', 
});

// 获取增强的控制台
const console = logger.selfconsole;

console.log('===== 样式使用示例 =====');

// 1. 索引样式示例 (0-6)
console.log('\n===== 索引样式 (0-6) =====');
console.csslog("样式0：红色粗体", 0);
console.csslog("样式1：蓝色粗体", 1);
console.csslog("样式2：绿色粗体", 2);
console.csslog("样式3：橙色粗体", 3);
console.csslog("样式4：紫色粗体", 4);
console.csslog("样式5：蓝绿色粗体", 5);
console.csslog("样式6：棕色粗体", 6);

// 2. 内置命名样式
console.log('\n===== 内置命名样式 =====');
console.log("%c紫色标题样式 (purple)", console.style.purple);
console.log("%c键样式 (key)", console.style.key);
console.log("%c值样式 (value)", console.style.value);
console.log("%c标记样式 (markedness)", console.style.markedness);
console.log("%c错误样式 (error)", console.style.error);
console.log("%c写日志样式 (writeLog)", console.style.writeLog);
console.log("%c大盒子样式 (bigBox)", console.style.bigBox);

// 3. 自定义样式
console.log('\n===== 自定义样式 =====');

// 直接使用自定义样式
console.csslog("红色背景白字", "color: white; background: red; padding: 2px 5px; border-radius: 3px;");
console.csslog("绿色背景黑字", "color: black; background: lightgreen; padding: 2px 5px; border-radius: 3px;");
console.csslog("蓝色背景白字", "color: white; background: blue; padding: 2px 5px; border-radius: 3px;");
console.csslog("黄色背景黑字", "color: black; background: yellow; padding: 2px 5px; border-radius: 3px;");

// 4. 添加自定义样式到style对象
console.log('\n===== 添加自定义样式到style对象 =====');

// 添加成功、警告、失败三种样式
console.style.success = "color: green; font-weight: bold; background: #e8f5e9; padding: 2px 5px; border-radius: 3px;";
console.style.warning = "color: orange; font-weight: bold; background: #fff3e0; padding: 2px 5px; border-radius: 3px;";
console.style.failure = "color: red; font-weight: bold; background: #ffebee; padding: 2px 5px; border-radius: 3px;";

// 使用自定义样式
console.log("%c✓ 操作成功", console.style.success);
console.log("%c⚠ 操作警告", console.style.warning);
console.log("%c✗ 操作失败", console.style.failure);

// 5. 高级样式组合
console.log('\n===== 高级样式组合 =====');

// 添加一些高级样式
console.style.button = "color: white; background: #4CAF50; padding: 5px 10px; border-radius: 5px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);";
console.style.card = "color: #333; background: #f8f8f8; padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
console.style.badge = "color: white; background: #f44336; padding: 2px 6px; border-radius: 10px; font-size: 12px; font-weight: bold;";

console.log("%c按钮样式", console.style.button);
console.log("%c卡片样式", console.style.card);
console.log("%c徽章样式", console.style.badge);

// 6. 实际应用场景
console.log('\n===== 实际应用场景 =====');

// 登录场景
console.log("%c用户登录", console.style.purple);
console.log("%c用户名", console.style.key, "admin");
console.log("%c密码", console.style.key, "********");
console.log("%c登录状态", console.style.key, "%c成功", console.style.success);

// 系统状态
console.log("%c系统状态", console.style.purple);
console.log("%c服务器", console.style.key, "%c在线", console.style.success);
console.log("%c数据库", console.style.key, "%c警告", console.style.warning);
console.log("%c缓存", console.style.key, "%c离线", console.style.failure);

// 错误信息
console.log("%c错误信息", console.style.error);
console.log("无法连接到服务器，请检查网络连接。");

console.log('\n===== 样式示例结束 ====='); 