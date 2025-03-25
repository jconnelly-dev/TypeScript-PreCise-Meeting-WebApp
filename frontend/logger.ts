import { PreCiseException } from './precise-exception.js';

export class Logger {

    public static readonly LogLevel = {
        TRACE: "TRACE",
        DEBUG: "DEBUG",
        TEST: "TEST",
        INFO: "INFO",
        PROD: "PROD",
        WARN: "WARN",
        ERROR: "ERROR",
        FATAL: "FATAL"
    } as const;  // use `as const` to ensure values are treated as literals

    // This map will define the priority of log levels (lower number = higher priority).
    private static readonly LogLevelPriority: { [key: string]: number } = {
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
    private static CURRENT_LEVEL: keyof typeof Logger.LogLevel = Logger.LogLevel.PROD;

    // Method to set the current log level.
    public static setLogLevel(level: keyof typeof Logger.LogLevel): void {
        Logger.CURRENT_LEVEL = level;
    }

    public static log(lvl: keyof typeof Logger.LogLevel, cls: string | Function, fnct: Function, msg?: string): void {

        if (Logger.LogLevelPriority[lvl] < Logger.LogLevelPriority[Logger.CURRENT_LEVEL]) {
            return;
        }

        let logText: string = Logger.getLogHeader(lvl, cls, fnct);
        if (msg) {
            logText += ` ${msg}`;
        }

        console.log(logText);
    }

    public static error(lvl: keyof typeof Logger.LogLevel, cls: string | Function, fnct: Function, err?: Error): void {

        if (Logger.LogLevelPriority[lvl] < Logger.LogLevelPriority[Logger.CURRENT_LEVEL]) {
            return;
        }

        let logText: string = Logger.getLogHeader(lvl, cls, fnct);
        if (err && err.message) {

            let errorName: string = "";
            let errorStack: string = "";
            if (err instanceof PreCiseException) {
                errorName = Logger.nameof(PreCiseException);
            } else {
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

    private static getLogHeader(lvl: keyof typeof Logger.LogLevel, cls: string | Function, fnct: Function): string {

        const localNow: Date = new Date();

        let className: string = "";
        if (typeof cls === 'string') {
            className = `${cls}.`;
        } else {
            className = `${Logger.nameof(cls)}.`;
        }

        return `[${localNow}] [${lvl}] [${className}${Logger.nameof(fnct)}()]`;
    }

    private static nameof(fnct: Function): string {
        return fnct.name;
    }
}