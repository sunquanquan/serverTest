import * as log4js from 'log4js';

export namespace common {

    export class Logger {
        static l: log4js.Logger;
        static d: log4js.Logger;

        static init(path: string, name: string) {
            if (Logger.l == null) {
                log4js.configure({
                    appenders: {
                        console: { type: 'stdout' },
                        logfile: { 
                            type: 'dateFile', 
                            filename: path + "/logs/", 
                            pattern: name + '-yyyy-MM-dd.log', 
                            alwaysIncludePattern: true, 
                            backups: 100, 
                            level: "debug", 
                            category: "normal" 
                        },
                        debugfile: { 
                            type: 'dateFile', 
                            filename: path + "/logs/", 
                            pattern: name + '-debug-yyyy-MM-dd.log', 
                            alwaysIncludePattern: true, 
                            backups: 100, 
                            level: "debug", 
                            category: "debug"
                        },
                    },
                    categories: {
                        default: { 
                            appenders: ['console'], 
                            level: 'debug' 
                        },
                        normal: { 
                            appenders: ['console', 'logfile'], 
                            level: 'debug' 
                        },
                        debug: { 
                            appenders: ['console', 'debugfile'], 
                            level: 'debug' 
                        },
                    }
                });
                Logger.l = log4js.getLogger("normal");
                Logger.d = log4js.getLogger("debug");
            }
        }
        static info(message: string, ...args: any[]) {
            Logger.l.info(message, ...args);
        }
        static warn(message: string, ...args: any[]) {
            Logger.l.warn(message, ...args);
        }
        static error(message: string, ...args: any[]) {
            Logger.l.error(message, ...args);
        }
        static debug(message: string, ...args: any[]) {
            Logger.d.debug(message, ...args);
        }
    }   // class Logger

}   // namespace unit

