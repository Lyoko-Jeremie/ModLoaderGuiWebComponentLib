import {Injectable} from '@angular/core';
import type {IGuiWebComponentLib} from "../../../src/IGuiWebComponentLib";

@Injectable({
  providedIn: null,
})
export class GuiWebComponentLibRefService {

  get ref(): IGuiWebComponentLib {
    if (!window.modGuiWebComponentLib) {
      console.error("[GuiWebComponentLibRefService] window.modGuiWebComponentLib not init complete");
      throw new Error("[GuiWebComponentLibRefService] window.modGuiWebComponentLib not init complete");
    }
    return window.modGuiWebComponentLib;
  }

  constructor() {
  }
}
