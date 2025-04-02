import { expect } from 'chai';
import { SlogConsole, LogLevel } from '../lib/index.js';
// 使用记录而不是实际输出的方法来测试
import assert from 'assert';

// 创建一个用于测试的mock console
function createMockConsole() {
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push({ type: 'log', args }),
    warn: (...args) => logs.push({ type: 'warn', args }),
    error: (...args) => logs.push({ type: 'error', args }),
    info: (...args) => logs.push({ type: 'info', args }),
    debug: (...args) => logs.push({ type: 'debug', args }),
    group: (...args) => logs.push({ type: 'group', args }),
    groupEnd: () => logs.push({ type: 'groupEnd' }),
    table: (...args) => logs.push({ type: 'table', args }),
    time: () => {},
    timeEnd: () => {},
    logs
  };
  return mockConsole;
}

describe('SlogConsole', () => {
  let testConsole;
  let mockConsole;
  let originalConsole;

  beforeEach(() => {
    // 保存原始控制台
    originalConsole = global.console;
    // 创建模拟控制台
    mockConsole = createMockConsole();
    // 替换全局控制台
    global.console = mockConsole;
    // 创建测试实例
    testConsole = new SlogConsole();
  });

  afterEach(() => {
    // 恢复原始控制台
    global.console = originalConsole;
  });

  describe('Basic functionality', () => {
    it('should create a SlogConsole instance', () => {
      expect(testConsole).to.be.an.instanceOf(SlogConsole);
      expect(testConsole.log).to.be.a('function');
      expect(testConsole.debug).to.be.a('function');
      expect(testConsole.info).to.be.a('function');
      expect(testConsole.warn).to.be.a('function');
      expect(testConsole.error).to.be.a('function');
    });

    it('should have default log level set to DEBUG', () => {
      expect(testConsole.logLevel).to.equal(LogLevel.DEBUG);
    });
  });

  describe('Log Levels', () => {
    it('should respect log levels', () => {
      testConsole.logLevel = LogLevel.DEBUG;
      
      mockConsole.logs = []; // 清除记录
      testConsole.debug('debug message');
      testConsole.info('info message');
      assert(mockConsole.logs.length > 0, '应该输出日志');
      
      const debugLogs = mockConsole.logs.filter(log => log.type === 'debug');
      assert(debugLogs.length > 0, '应该有DEBUG级别的日志');
    });

    it('should not log in production environment', () => {
      const prodConsole = new SlogConsole({ environment: 'production' });
      
      mockConsole.logs = []; // 清除记录
      prodConsole.log('test message');
      prodConsole.debug('debug message');
      
      assert.equal(mockConsole.logs.length, 0, '生产环境不应该输出日志');
    });
  });

  describe('Log History', () => {
    it('should record logs in history', () => {
      testConsole.log('test message');
      expect(testConsole.history.length).to.equal(1);
      expect(testConsole.history[0].message).to.equal('test message');
    });

    it('should clear history', () => {
      testConsole.log('test message');
      testConsole.clearHistory();
      expect(testConsole.history.length).to.equal(0);
    });

    it('should export logs as JSON', () => {
      testConsole.log('test message');
      const jsonLogs = testConsole.exportLogs('json');
      expect(jsonLogs).to.be.a('string');
      const parsed = JSON.parse(jsonLogs);
      expect(parsed).to.be.an('array');
      expect(parsed[0].message).to.equal('test message');
    });

    it('should export logs as text', () => {
      testConsole.log('test message');
      const textLogs = testConsole.exportLogs('text');
      expect(textLogs).to.be.a('string');
      expect(textLogs).to.include('test message');
    });
  });

  describe('Tagged Logs', () => {
    it('should add tags to logs', () => {
      testConsole.taggedLog(['user', 'auth'], 'login successful');
      expect(testConsole.history[0].tags).to.deep.equal(['user', 'auth']);
      expect(testConsole.history[0].message).to.equal('login successful');
    });
  });

  describe('Prefixed Logs', () => {
    it('should create prefixed logger', () => {
      // 创建独立的测试实例和控制台
      const mockConsole2 = createMockConsole();
      const originalConsole2 = global.console;
      global.console = mockConsole2;
      const testConsole2 = new SlogConsole();
      
      const userLogger = testConsole2.withPrefix('User');
      mockConsole2.logs = []; // 清除记录
      userLogger.log('test message');
      
      expect(testConsole2.history.length).to.equal(1);
      expect(testConsole2.history[0].prefix).to.equal('User');
      expect(testConsole2.history[0].message).to.include('[User]');
      
      // 恢复原始控制台
      global.console = originalConsole2;
    });

    it('should support multiple prefixed loggers', () => {
      // 创建独立的测试实例和控制台
      const mockConsole2 = createMockConsole();
      const originalConsole2 = global.console;
      global.console = mockConsole2;
      const testConsole2 = new SlogConsole();
      
      const userLogger = testConsole2.withPrefix('User');
      const authLogger = testConsole2.withPrefix('Auth');
      
      mockConsole2.logs = []; // 清除记录
      userLogger.log('user message');
      authLogger.log('auth message');
      
      expect(testConsole2.history.length).to.equal(2);
      expect(testConsole2.history[0].prefix).to.equal('User');
      expect(testConsole2.history[1].prefix).to.equal('Auth');
      
      // 恢复原始控制台
      global.console = originalConsole2;
    });
  });

  describe('Conditional Logs', () => {
    it('should log only when condition is true', () => {
      testConsole.logIf(true, 'should log');
      testConsole.logIf(false, 'should not log');
      expect(testConsole.history.length).to.equal(1);
      expect(testConsole.history[0].message).to.equal('should log');
    });
  });

  describe('Throttled Logs', () => {
    it('should throttle logs with same key', () => {
      testConsole.throttledLog('test-key', 'message 1');
      testConsole.throttledLog('test-key', 'message 2');
      expect(testConsole.history.length).to.equal(1);
      expect(testConsole.history[0].message).to.equal('message 1');
    });

    it('should not throttle logs with different keys', () => {
      testConsole.throttledLog('key1', 'message 1');
      testConsole.throttledLog('key2', 'message 2');
      expect(testConsole.history.length).to.equal(2);
      expect(testConsole.history[0].message).to.equal('message 1');
      expect(testConsole.history[1].message).to.equal('message 2');
    });
  });

  describe('Formatting', () => {
    it('should format table correctly', () => {
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      mockConsole.logs = []; // 清除记录
      testConsole.table(data);
      
      expect(testConsole.history.length).to.equal(1);
      expect(mockConsole.logs.length).to.be.at.least(1);
      expect(mockConsole.logs[0].type).to.equal('table');
    });

    it('should handle grouped logs', () => {
      mockConsole.logs = []; // 清除记录
      
      testConsole.group('Test Group');
      testConsole.log('grouped message');
      testConsole.groupEnd();
      
      expect(testConsole.history.length).to.equal(2);
      expect(testConsole.history[0].message).to.include('Test Group');
      expect(testConsole.history[1].message).to.equal('grouped message');
      
      // 检查输出
      expect(mockConsole.logs.length).to.be.at.least(3);
      expect(mockConsole.logs[0].type).to.equal('group');
      expect(mockConsole.logs[1].type).to.equal('log');
      expect(mockConsole.logs[2].type).to.equal('groupEnd');
    });
  });

  describe('Styled Logs', () => {
    it('should support csslog with numeric style index', () => {
      mockConsole.logs = []; // 清除记录
      testConsole.csslog('styled message', 0);
      
      expect(testConsole.history.length).to.equal(1);
      expect(testConsole.history[0].message).to.equal('styled message');
      expect(mockConsole.logs.length).to.be.at.least(1);
    });

    it('should support csslog with custom style string', () => {
      mockConsole.logs = []; // 清除记录
      testConsole.csslog('custom styled', 'color: green; font-size: 16px;');
      
      expect(testConsole.history.length).to.equal(1);
      expect(testConsole.history[0].message).to.equal('custom styled');
      expect(mockConsole.logs.length).to.be.at.least(1);
    });

    it('should have predefined styles', () => {
      expect(testConsole.style).to.be.an('object');
      expect(testConsole.style.purple).to.be.a('string');
      expect(testConsole.style.key).to.be.a('string');
      expect(testConsole.style.value).to.be.a('string');
    });
  });

  describe('Write Logs', () => {
    it('should call write log function when wlog is called', () => {
      let called = false;
      let logMessage = '';
      
      const logConsole = new SlogConsole({
        consoleWriteLogFun: (message) => {
          called = true;
          logMessage = message;
        }
      });
      
      logConsole.wlog('test write log');
      
      expect(called).to.be.true;
      expect(logMessage).to.equal('test write log');
    });
  });

  describe('Configuration', () => {
    it('should accept configuration in constructor', () => {
      const configConsole = new SlogConsole({
        openLevel: LogLevel.WARN,
        environment: 'development'
      });
      
      expect(configConsole.logLevel).to.equal(LogLevel.WARN);
      expect(configConsole.log).to.be.a('function');
    });
  });
}); 