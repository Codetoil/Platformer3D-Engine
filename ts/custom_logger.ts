interface FormatSpecifierSearcher {
  foundSymbol: boolean;
  hasFormatSpecifiers: boolean;
  specifierEnd: number;
}

export default class NewConsole implements Console {
  private oldConsole: Console;
  private countMap: Map<string, number>;
  public Console: console.ConsoleConstructor; // Do not use, use `new NewConsole()`

  constructor(oldConsole: Console) {
    this.oldConsole = oldConsole;
    this.countMap = new Map<string, number>();
  }

  private hasFormatSpecifiers(formatString: string): boolean {
    return Object.values(formatString).reduce(
      (previousValue: FormatSpecifierSearcher, currentCharacter: string) => {
        return {
          foundSymbol: currentCharacter === "%",
          hasFormatSpecifiers:
            previousValue.hasFormatSpecifiers ||
            (previousValue.foundSymbol &&
              (currentCharacter === "s" ||
                currentCharacter === "d" ||
                currentCharacter === "i" ||
                currentCharacter === "f" ||
                currentCharacter === "o" ||
                currentCharacter === "0")),
          specifierEnd: 0,
        };
      },
      {
        foundSymbol: false,
        hasFormatSpecifiers: false,
        specifierEnd: 0,
      }
    ).hasFormatSpecifiers;
  }

  private printer(logLevel: string, args: any[]): void {
    let argsStr = Object.values(args).reduce(
      (previousValue, currentCharacter) => {
        return previousValue + " " + currentCharacter;
      },
      ""
    );

    let logElement = document.getElementById("log");

    if (logElement) {
      logElement.innerHTML += "[" + logLevel + "] " + argsStr + "<br>";
    }
  }

  private formatter(args: any[]): any[] {
    let target: string = args[0];
    let current: any = args[1];
    let result = args.filter((_e: any, i: number) => {
      return i > 1;
    });

    let specifierPos =
      Object.values(target).reduce(
        (previousValue: FormatSpecifierSearcher, currentCharacter: string) => {
          return {
            foundSymbol: currentCharacter === "%",
            hasFormatSpecifiers:
              previousValue.hasFormatSpecifiers ||
              (previousValue.foundSymbol &&
                (currentCharacter === "s" ||
                  currentCharacter === "d" ||
                  currentCharacter === "i" ||
                  currentCharacter === "f" ||
                  currentCharacter === "o" ||
                  currentCharacter === "0")),
            specifierEnd:
              previousValue.specifierEnd +
              (previousValue.hasFormatSpecifiers ? 0 : 1),
          };
        },
        {
          foundSymbol: false,
          hasFormatSpecifiers: false,
          specifierEnd: 0,
        }
      ).specifierEnd - 2;
    let specifier = Object.values(target)
      .splice(specifierPos, 2)
      .reduce((previousValue, currentCharacter) => {
        return previousValue + currentCharacter;
      }, "");
    let converted: any;
    switch (specifier) {
      case "%s":
        converted = String(current);
        break;
      case "%d":
      case "%i":
        if (typeof current === "symbol") {
          converted = NaN;
        } else {
          converted = parseInt(current, 10);
        }
        break;
      case "%f":
        if (typeof current === "symbol") {
          converted = NaN;
        } else {
          converted = parseFloat(current);
        }
        break;
      case "%o":
        converted = current;
        break;
      case "%0":
        converted = current;
        break;
      default:
        converted = current;
        break;
    }
    target =
      Object.values(target)
        .splice(0, specifierPos)
        .reduce((previousValue, currentCharacter) => {
          return previousValue + currentCharacter;
        }, "") +
      converted +
      Object.values(target)
        .splice(specifierPos + 2)
        .reduce((previousValue, currentCharacter) => {
          return previousValue + currentCharacter;
        }, "");
    result.unshift(target);
    /*this.printer("formatter", ["target:", target]);
    this.printer("formatter", ["current:", current]);
    this.printer("formatter", ["Type(current):", typeof current]);
    this.printer("formatter", ["specifierEnd:", specifierEnd]);
    this.printer("formatter", ["specifier:", specifier]);
    this.printer("formatter", ["converted:", converted]);
    this.printer("formatter", ["result:", result]);
    this.printer("formatter", []);*/
    if (!this.hasFormatSpecifiers(target)) return result;
    if (result.length === 1) return result;
    return this.formatter(result);
  }

  private logger(logLevel: string, formatString: string, rest?: any[]): void {
    /*
    this.printer("logger", ["formatString:", formatString]);
    this.printer("logger", ["rest:" , rest]);
    this.printer("logger", ["rest.length:" , rest.length]);
    this.printer("logger", []);
    */
    if (rest.length === 0) {
      this.printer(logLevel, [formatString]);
    } else {
      if (!this.hasFormatSpecifiers(formatString)) {
        this.printer(logLevel, [formatString, ...rest]);
      } else {
        this.printer(logLevel, this.formatter([formatString, ...rest]));
      }
    }
  }

  public assert(
    value: boolean = false,
    message: string = "Assertion failed",
    ...optionalParams: any[]
  ): void {
    if (value) return;
    this.logger("assert", message, optionalParams);
    this.oldConsole.assert(value, message, optionalParams);
  }

  public clear(): void {
    this.oldConsole.clear();
  }
  public debug(message?: string, ...optionalParams: any[]): void {
    this.logger("debug", message, optionalParams);
    this.oldConsole.debug(message, optionalParams);
  }
  public error(message?: string, ...optionalParams: any[]): void {
    this.logger("error", message, optionalParams);
    this.oldConsole.error(message, optionalParams);
  }
  info(message?: string, ...optionalParams: any[]): void {
    this.logger("info", message, optionalParams);
    this.oldConsole.info(message, optionalParams);
  }
  log(message?: string, ...optionalParams: any[]): void {
    this.logger("log", message, optionalParams);
    this.oldConsole.log(message, optionalParams);
  }
  table(tabularData: any, properties: readonly string[]): void {
    this.oldConsole.table(tabularData, properties);
  }
  trace(message?: string, ...optionalParams: any[]): void {
    this.oldConsole.trace(message, optionalParams);
  }
  warn(message?: string, ...optionalParams: any[]): void {
    this.logger("warn", message, optionalParams);
    this.oldConsole.warn(message, optionalParams);
  }
  dir(item?: any, options: any = {}): void {
    this.oldConsole.dir(item, options);
  }
  dirxml(...data: any[]): void {
    this.oldConsole.dirxml(data);
  }

  count(label: string = "default"): void {
    if (this.countMap[label] !== undefined) {
      this.countMap[label]++;
    } else {
      this.countMap[label] = 1;
    }
    this.logger("count", label + ": " + this.countMap[label]);
    this.oldConsole.count(label);
  }
  countReset(label: string = "default"): void {
    if (this.countMap[label] !== undefined) {
      this.countMap[label] = 0;
    } else {
      this.logger(
        "countReset",
        "Label `" + label + "` does not have an associated count"
      );
    }
    this.oldConsole.countReset(label);
  }

  group(...label: any[]): void {
    this.oldConsole.group(label);
  }
  groupCollapsed(...label: any[]): void {
    this.oldConsole.groupCollapsed(label);
  }
  groupEnd(): void {
    this.oldConsole.groupEnd();
  }

  time(label: string = "default"): void {
    this.oldConsole.time(label);
  }
  timeLog(label: string = "default", ...data: any[]): void {
    this.oldConsole.timeLog(label, data);
  }
  timeStamp(label: string = "default"): void {
    this.oldConsole.timeStamp(label);
  }
  timeEnd(label: string = "default"): void {
    this.oldConsole.timeEnd(label);
  }

  profile(label: string = "default"): void {
    this.oldConsole.profile(label);
  }
  profileEnd(label: string = "default"): void {
    this.oldConsole.profileEnd(label);
  }

  exception(message?: string, ...optionalParams: any[]): void {
    this.oldConsole.exception(message, optionalParams);
  }

  get memory(): any {
    return this.oldConsole.memory;
  }
}
