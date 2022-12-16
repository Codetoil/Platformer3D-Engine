/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
/// <reference types="node" />
export default class NewConsole implements Console {
    private oldConsole;
    private countMap;
    Console: console.ConsoleConstructor;
    constructor(oldConsole: Console);
    private hasFormatSpecifiers;
    private printer;
    private formatter;
    private logger;
    assert(value?: boolean, message?: string, ...optionalParams: any[]): void;
    clear(): void;
    debug(message?: string, ...optionalParams: any[]): void;
    error(message?: string, ...optionalParams: any[]): void;
    info(message?: string, ...optionalParams: any[]): void;
    log(message?: string, ...optionalParams: any[]): void;
    table(tabularData: any, properties: readonly string[]): void;
    trace(message?: string, ...optionalParams: any[]): void;
    warn(message?: string, ...optionalParams: any[]): void;
    dir(item?: any, options?: any): void;
    dirxml(...data: any[]): void;
    count(label?: string): void;
    countReset(label?: string): void;
    group(...label: any[]): void;
    groupCollapsed(...label: any[]): void;
    groupEnd(): void;
    time(label?: string): void;
    timeLog(label?: string, ...data: any[]): void;
    timeStamp(label?: string): void;
    timeEnd(label?: string): void;
    profile(label?: string): void;
    profileEnd(label?: string): void;
    exception(message?: string, ...optionalParams: any[]): void;
    get memory(): any;
}
//# sourceMappingURL=custom_logger.d.ts.map