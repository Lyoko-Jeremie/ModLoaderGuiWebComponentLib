import {IGuiWebComponentLib, LogWrapper} from "../../src/IGuiWebComponentLib";

class MookLogWrapper {
  log(s: string) {
    console.log(s);
  }

  warn(s: string) {
    console.warn(s);
  }

  error(s: string) {
    console.error(s);
  }
}

export class MookGuiWebComponentLib implements IGuiWebComponentLib {
  logger: LogWrapper = new MookLogWrapper();
  modName: string = 'AMod';

  get modLoaderVersion(): string {
    return "1.2.3";
  }

}
