import { Config, StyleTemplate, defaultConfig, styleContent, Environment } from "./config.js";

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel | string;
  message: any[];
  tags?: string[];
}

/**
 * 增强的控制台接口
 */
export interface SlogConsole extends Console {
  // 原有功能
  style: typeof styleContent;
  wlog: (...params: any[]) => void;
  csslog: (text: string, ...styleArr: (number | string)[]) => void;
  
  // 新增功能
  logLevel: LogLevel;                              // 当前日志级别
  history: LogEntry[];                             // 日志历史记录
  
  // 带日志级别的输出方法
  debug: (...params: any[]) => void;              // 调试日志
  info: (...params: any[]) => void;               // 信息日志
  
  // 带标签的日志
  taggedLog: (tags: string[], ...params: any[]) => void; // 带标签的日志
  
  // 条件日志
  logIf: (condition: boolean, ...params: any[]) => void; // 条件日志
  
  // 带前缀的日志
  withPrefix: (prefix: string) => Omit<SlogConsole, 'withPrefix'>; // 创建带前缀的日志记录器
  
  // 清除历史
  clearHistory: () => void;                        // 清除历史记录
  
  // 导出日志
  exportLogs: (format?: 'json' | 'text') => string; // 导出日志
  
  // 限流日志(避免短时间内输出过多)
  throttledLog: (key: string, ...params: any[]) => void; // 限流日志
}

export default class Slog {
  // 配置
  public config: Config;
  // 增强版console
  public selfconsole: SlogConsole;
  // 原生console
  public original_console: Console = console;
  // 日志历史
  private logHistory: LogEntry[] = [];
  // 限流日志的时间戳记录
  private throttleTimestamps: Record<string, number> = {};
  // 默认限流时间间隔(毫秒)
  private readonly throttleInterval: number = 1000;

  constructor(c: Partial<Config> = {}) {
    this.config = {
      ...defaultConfig,
      ...c
    };
    
    // 初始化增强版console
    this.selfconsole = this.observe();
    this.setupWriteLog();
    this.consoleStyle();
    this.setupCsslog();
    this.setupExtendedFeatures();
  }

  observe(): SlogConsole {
    // 非开发环境时，屏蔽所有控制台输出
    if (this.config.environment !== "development") {
      // 创建空方法代理所有console方法
      const emptyConsole = {} as SlogConsole;
      
      Object.keys(console).forEach((key) => {
        // @ts-ignore - 动态属性分配
        emptyConsole[key] = () => {};
      });
      
      return emptyConsole;
    }
    
    // 开发环境时，使用代理增强console功能
    return new Proxy(console as unknown as SlogConsole, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  setupWriteLog(): void {
    this.selfconsole.wlog = (...params: any[]) => {
      // 如果配置了写日志回调函数，则调用
      if (typeof this.config.consoleWriteLogFun === "function") {
        this.config.consoleWriteLogFun(...params);
      }

      this.selfconsole.log(...params);
    };
  }

  consoleStyle(): void {
    this.selfconsole.style = styleContent;
  }

  setupCsslog(): void {
    this.selfconsole.csslog = (text: string, ...styleArr: (number | string)[]) => {
      const styleArrKeys: Array<string> = Object.keys(styleContent);
      const styleData: any[] = [];
      
      styleArr.forEach((element: number | string) => {
        if (typeof element === "number") {
          const indexKey = styleArrKeys[element] ? styleArrKeys[element] : "error";
          if (indexKey in styleContent) {
            styleData.push(styleContent[indexKey as keyof typeof styleContent]);
          } else {
            styleData.push(styleContent.error);
          }
        } else {
          styleData.push(element);
        }
      });
      
      this.selfconsole.log(text, ...styleData);
    };
  }
  
  // 新增扩展功能方法
  private setupExtendedFeatures(): void {
    const self = this;
    
    // 日志级别
    this.selfconsole.logLevel = LogLevel.DEBUG;
    
    // 历史记录
    this.selfconsole.history = this.logHistory;
    
    // 清除历史
    this.selfconsole.clearHistory = (): void => {
      this.logHistory = [];
      this.selfconsole.history = this.logHistory;
    };
    
    // 日志级别方法
    this.selfconsole.debug = (...params: any[]): void => {
      if (this.selfconsole.logLevel <= LogLevel.DEBUG) {
        this.addToHistory(LogLevel.DEBUG, params);
        this.selfconsole.log('[DEBUG]', ...params);
      }
    };
    
    this.selfconsole.info = (...params: any[]): void => {
      if (this.selfconsole.logLevel <= LogLevel.INFO) {
        this.addToHistory(LogLevel.INFO, params);
        this.selfconsole.log('[INFO]', ...params);
      }
    };
    
    // 带标签的日志
    this.selfconsole.taggedLog = (tags: string[], ...params: any[]): void => {
      const tagStr = tags.map(tag => `[${tag}]`).join(' ');
      this.addToHistory(LogLevel.INFO, params, tags);
      this.selfconsole.log(tagStr, ...params);
    };
    
    // 条件日志
    this.selfconsole.logIf = (condition: boolean, ...params: any[]): void => {
      if (condition) {
        this.selfconsole.log(...params);
      }
    };
    
    // 带前缀的日志
    this.selfconsole.withPrefix = (prefix: string) => {
      const prefixedConsole = {} as Omit<SlogConsole, 'withPrefix'>;
      
      // 复制原有方法
      const methodsToCopy = ['log', 'warn', 'error', 'info', 'debug'];
      methodsToCopy.forEach(method => {
        // @ts-ignore
        prefixedConsole[method] = (...params: any[]) => {
          // @ts-ignore
          this.selfconsole[method](prefix, ...params);
        };
      });
      
      return prefixedConsole;
    };
    
    // 导出日志
    this.selfconsole.exportLogs = (format: 'json' | 'text' = 'json'): string => {
      if (format === 'json') {
        return JSON.stringify(this.logHistory, null, 2);
      } else {
        return this.logHistory.map(entry => 
          `${entry.timestamp} [${entry.level}]${entry.tags ? ' [' + entry.tags.join(', ') + ']' : ''}: ${entry.message.join(' ')}`
        ).join('\n');
      }
    };
    
    // 限流日志
    this.selfconsole.throttledLog = (key: string, ...params: any[]): void => {
      const now = Date.now();
      const lastTime = this.throttleTimestamps[key] || 0;
      
      if (now - lastTime >= this.throttleInterval) {
        this.throttleTimestamps[key] = now;
        this.selfconsole.log(`[${key}]`, ...params);
      }
    };
  }
  
  // 添加到历史记录
  private addToHistory(level: LogLevel, message: any[], tags?: string[]): void {
    if (this.logHistory.length > 1000) {
      // 防止内存泄漏，限制历史记录长度
      this.logHistory.shift();
    }
    
    this.logHistory.push({
      timestamp: new Date().toISOString(),
      level: LogLevel[level] || level,
      message,
      tags
    });
    
    // 更新引用
    this.selfconsole.history = this.logHistory;
  }
}
