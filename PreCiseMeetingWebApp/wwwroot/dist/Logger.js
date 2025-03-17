import { PreCiseException } from './PreCiseException.js';
export class Logger {
    // Method to set the current log level.
    static setLogLevel(level) {
        Logger.CURRENT_LEVEL = level;
    }
    static log(lvl, cls, fnct, msg) {
        if (Logger.LogLevelPriority[lvl] < Logger.LogLevelPriority[Logger.CURRENT_LEVEL]) {
            return;
        }
        let logText = this.getLogHeader(lvl, cls, fnct);
        if (msg) {
            logText += ` ${msg}`;
        }
        console.log(logText);
    }
    static error(lvl, cls, fnct, err) {
        if (Logger.LogLevelPriority[lvl] < Logger.LogLevelPriority[Logger.CURRENT_LEVEL]) {
            return;
        }
        let logText = this.getLogHeader(lvl, cls, fnct);
        if (err && err.message) {
            let errorName = "";
            let errorStack = "";
            if (err instanceof PreCiseException) {
                errorName = this.nameof(PreCiseException);
            }
            else {
                errorName = "Unexpected Error";
                if (err.stack) {
                    const newLine = (typeof window === "undefined") ? "\r\n" : "\n"; // for Node.js vs browser
                    errorStack = `${newLine}${err.stack}`;
                }
            }
            logText += ` ${errorName}: ${err.message}${errorStack}`;
        }
        console.log(logText);
    }
    static getLogHeader(lvl, cls, fnct) {
        const localNow = new Date();
        let className = "";
        if (typeof cls === 'string') {
            className = `${cls}.`;
        }
        else {
            className = `${this.nameof(cls)}.`;
        }
        return `[${localNow}] [${lvl}] [${className}${this.nameof(fnct)}()]`;
    }
    static nameof(fnct) {
        return fnct.name;
    }
}
Logger.LogLevel = {
    TRACE: "TRACE",
    DEBUG: "DEBUG",
    TEST: "TEST",
    INFO: "INFO",
    PROD: "PROD",
    WARN: "WARN",
    ERROR: "ERROR",
    FATAL: "FATAL"
}; // use `as const` to ensure values are treated as literals
// This map will define the priority of log levels (lower number = higher priority).
Logger.LogLevelPriority = {
    [Logger.LogLevel.TRACE]: 0,
    [Logger.LogLevel.DEBUG]: 1,
    [Logger.LogLevel.TEST]: 2,
    [Logger.LogLevel.INFO]: 3,
    [Logger.LogLevel.PROD]: 4,
    [Logger.LogLevel.WARN]: 5,
    [Logger.LogLevel.ERROR]: 6,
    [Logger.LogLevel.FATAL]: 7
};
// Current log level - only logs messages at or above this level.
Logger.CURRENT_LEVEL = Logger.LogLevel.PROD;
