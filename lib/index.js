export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
export class SlogConsole {
    constructor(config) {
        this._logLevel = LogLevel.DEBUG;
        this._history = [];
        this._throttleMap = new Map();
        this._throttleInterval = 1000; // 1秒
        this._consoleWriteLogFun = null;
        this._environment = 'development';
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
                this._logLevel = config.openLevel;
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
    get selfconsole() {
        return this;
    }
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(level) {
        this._logLevel = level;
    }
    shouldLog(level) {
        if (this._environment === 'production') {
            return false;
        }
        return level >= this._logLevel;
    }
    get history() {
        return [...this._history];
    }
    addToHistory(entry) {
        this._history.push(entry);
    }
    clearHistory() {
        this._history = [];
    }
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this._history, null, 2);
        }
        else {
            return this._history.map(entry => {
                const prefix = entry.prefix ? `[${entry.prefix}] ` : '';
                const tags = entry.tags ? ` [${entry.tags.join(', ')}]` : '';
                return `${entry.timestamp.toISOString()} ${prefix}${entry.message}${tags}`;
            }).join('\n');
        }
    }
    taggedLog(tags, message, ...args) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: message,
                tags
            };
            this.addToHistory(entry);
            console.log(`[${tags.join(', ')}] ${message}`, ...args);
        }
    }
    withPrefix(prefix) {
        const prefixedConsole = new SlogConsole();
        prefixedConsole._logLevel = this._logLevel;
        prefixedConsole._history = this._history;
        prefixedConsole._throttleMap = this._throttleMap;
        const methods = ['log', 'debug', 'info', 'warn', 'error'];
        methods.forEach(method => {
            const originalMethod = prefixedConsole[method].bind(prefixedConsole);
            prefixedConsole[method] = (message, ...args) => {
                const entry = {
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
    logIf(condition, message, ...args) {
        if (condition) {
            this.log(message, ...args);
        }
    }
    throttledLog(key, message, ...args) {
        const now = Date.now();
        const lastLog = this._throttleMap.get(key) || 0;
        if (now - lastLog >= this._throttleInterval) {
            this.log(message, ...args);
            this._throttleMap.set(key, now);
        }
    }
    wlog(message, ...args) {
        if (this._consoleWriteLogFun) {
            this._consoleWriteLogFun(message, ...args);
        }
        this.log(message, ...args);
    }
    csslog(message, style) {
        if (this.shouldLog(LogLevel.INFO)) {
            let cssStyle;
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
            }
            else {
                cssStyle = style;
            }
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: message
            };
            this.addToHistory(entry);
            console.log(`%c${message}`, cssStyle);
        }
    }
    debug(message, ...args) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.DEBUG,
                message: message
            };
            this.addToHistory(entry);
            console.debug(message, ...args);
        }
    }
    info(message, ...args) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: message
            };
            this.addToHistory(entry);
            console.info(message, ...args);
        }
    }
    warn(message, ...args) {
        if (this.shouldLog(LogLevel.WARN)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.WARN,
                message: message
            };
            this.addToHistory(entry);
            console.warn(message, ...args);
        }
    }
    error(message, ...args) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.ERROR,
                message: message
            };
            this.addToHistory(entry);
            console.error(message, ...args);
        }
    }
    log(message, ...args) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: message
            };
            this.addToHistory(entry);
            console.log(message, ...args);
        }
    }
    table(data, columns) {
        if (this.shouldLog(LogLevel.INFO)) {
            const stringifiedData = JSON.stringify(data);
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: stringifiedData
            };
            this.addToHistory(entry);
            console.table(data, columns);
        }
    }
    group(label) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = {
                timestamp: new Date(),
                level: LogLevel.INFO,
                message: `Group: ${label}`
            };
            this.addToHistory(entry);
            console.group(label);
        }
    }
    groupEnd() {
        if (this.shouldLog(LogLevel.INFO)) {
            console.groupEnd();
        }
    }
    time(label) {
        console.time(label);
    }
    timeEnd(label) {
        console.timeEnd(label);
    }
}
// 兼容现有API
export default class Slog {
    constructor(config) {
        this._console = new SlogConsole(config);
    }
    get selfconsole() {
        return this._console;
    }
}
//# sourceMappingURL=index.js.map