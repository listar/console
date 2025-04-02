export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  tags?: string[];
  prefix?: string;
}

export interface Config {
  // 日志输出级别
  openLevel?: number;
  // 日志记录级别
  openRewriteLogLevel?: number;
  // 日志记录主机地址
  requestLogHost?: string;
  // 日志记录回调函数
  consoleWriteLogFun?: Function;
  // 样式模板
  styleTemplate?: string;
  // 环境：development | production
  environment?: string;
}

export class SlogConsole {
  private _logLevel: LogLevel = LogLevel.DEBUG;
  private _history: LogEntry[] = [];
  private _throttleMap: Map<string, number> = new Map();
  private _throttleInterval: number = 1000; // 1秒
  private _consoleWriteLogFun: Function | null = null;
  private _environment: string = 'development';

  constructor(config?: Config) {
    // 绑定方法到实例
    this.log = this.log.bind(this);
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.table = this.table.bind(this);
    this.group = this.group.bind(this);
    this.groupEnd = this.groupEnd.bind(this);
    this.wlog = this.wlog.bind(this);

    // 应用配置
    if (config) {
      if (config.openLevel !== undefined) {
        this._logLevel = config.openLevel as LogLevel;
      }
      if (config.consoleWriteLogFun) {
        this._consoleWriteLogFun = config.consoleWriteLogFun;
      }
      if (config.environment) {
        this._environment = config.environment;
      }
    }

    // 添加样式
    this.style = {
      purple: "color: purple; font-weight: bold; font-size: 16px;",
      key: "color: blue; font-weight: bold;",
      value: "color: green; font-weight: normal;",
      // 可添加更多预设样式
    };
  }

  // 样式对象
  style: {[key: string]: string};

  get selfconsole(): SlogConsole {
    return this;
  }

  get logLevel(): LogLevel {
    return this._logLevel;
  }

  set logLevel(level: LogLevel) {
    this._logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this._environment === 'production') {
      return false;
    }
    return level >= this._logLevel;
  }

  get history(): LogEntry[] {
    return [...this._history];
  }

  private addToHistory(entry: LogEntry): void {
    this._history.push(entry);
  }

  clearHistory(): void {
    this._history = [];
  }

  exportLogs(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this._history, null, 2);
    } else {
      return this._history.map(entry => {
        const prefix = entry.prefix ? `[${entry.prefix}] ` : '';
        const tags = entry.tags ? ` [${entry.tags.join(', ')}]` : '';
        return `${entry.timestamp.toISOString()} ${prefix}${entry.message}${tags}`;
      }).join('\n');
    }
  }

  taggedLog(tags: string[], message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: message,
        tags
      };
      this.addToHistory(entry);
      console.log(`[${tags.join(', ')}] ${message}`, ...args);
    }
  }

  withPrefix(prefix: string): SlogConsole {
    const prefixedConsole = new SlogConsole();
    prefixedConsole._logLevel = this._logLevel;
    prefixedConsole._history = this._history;
    prefixedConsole._throttleMap = this._throttleMap;
    
    type LogMethod = 'log' | 'debug' | 'info' | 'warn' | 'error';
    const methods: LogMethod[] = ['log', 'debug', 'info', 'warn', 'error'];
    methods.forEach(method => {
      const originalMethod = prefixedConsole[method].bind(prefixedConsole);
      prefixedConsole[method] = (message: string, ...args: any[]) => {
        const entry: LogEntry = {
          timestamp: new Date(),
          level: LogLevel.INFO,
          message: `[${prefix}] ${message}`,
          prefix
        };
        this.addToHistory(entry);
        originalMethod(`[${prefix}] ${message}`, ...args);
      };
    });

    return prefixedConsole;
  }

  logIf(condition: boolean, message: string, ...args: any[]): void {
    if (condition) {
      this.log(message, ...args);
    }
  }

  throttledLog(key: string, message: string, ...args: any[]): void {
    const now = Date.now();
    const lastLog = this._throttleMap.get(key) || 0;

    if (now - lastLog >= this._throttleInterval) {
      this.log(message, ...args);
      this._throttleMap.set(key, now);
    }
  }

  wlog(message: string, ...args: any[]): void {
    if (this._consoleWriteLogFun) {
      this._consoleWriteLogFun(message, ...args);
    }
    this.log(message, ...args);
  }

  csslog(message: string, style: string | number): void {
    if (this.shouldLog(LogLevel.INFO)) {
      let cssStyle: string;
      if (typeof style === 'number') {
        // 预设样式
        const presetStyles = [
          "color: red; font-weight: bold;",
          "color: blue; font-weight: bold;",
          "color: green; font-weight: bold;",
          "color: orange; font-weight: bold;",
          "color: purple; font-weight: bold;",
          "color: teal; font-weight: bold;",
          "color: brown; font-weight: bold;"
        ];
        cssStyle = presetStyles[style % presetStyles.length];
      } else {
        cssStyle = style;
      }
      
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: message
      };
      this.addToHistory(entry);
      console.log(`%c${message}`, cssStyle);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.DEBUG,
        message: message
      };
      this.addToHistory(entry);
      console.debug(message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: message
      };
      this.addToHistory(entry);
      console.info(message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.WARN,
        message: message
      };
      this.addToHistory(entry);
      console.warn(message, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.ERROR,
        message: message
      };
      this.addToHistory(entry);
      console.error(message, ...args);
    }
  }

  log(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: message
      };
      this.addToHistory(entry);
      console.log(message, ...args);
    }
  }

  table(data: any, columns?: string[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const stringifiedData = JSON.stringify(data);
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: stringifiedData
      };
      this.addToHistory(entry);
      console.table(data, columns);
    }
  }

  group(label: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: `Group: ${label}`
      };
      this.addToHistory(entry);
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }
}

// 兼容现有API
export default class Slog {
  private _console: SlogConsole;

  constructor(config?: Config) {
    this._console = new SlogConsole(config);
  }

  get selfconsole(): SlogConsole {
    return this._console;
  }
} 