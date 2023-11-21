import type {WithProperties} from "@angular/elements";
import type {NgElement} from "@angular/elements";
import type {AppComponent} from "./app/app.component";
import type {NgGuiWebComponentLibBoot} from "./main";
import type {BeautySelectorAddonComponent} from "./beauty-selector-addon/beauty-selector-addon.component";
// import type {IGuiWebComponentLib} from "../../src/IGuiWebComponentLib";
// import type {GuiWebComponentLib} from "@GuiWebComponentLib/GuiWebComponentLib";
import type {IGuiWebComponentLib} from "@GuiWebComponentLib/IGuiWebComponentLib";

declare global {
  interface HTMLElementTagNameMap {
    'ng-gui-web-component-lib-app-component': NgElement & WithProperties<AppComponent>;
    'ng-gui-web-component-lib-beauty-selector-addon': NgElement & WithProperties<BeautySelectorAddonComponent>;
  }

  interface Window {
    modGuiWebComponentLib: IGuiWebComponentLib;

    modNgGuiWebComponentLib: NgGuiWebComponentLibBoot;
    modNgGuiWebComponentLibBootstrapFactory: () => Promise<NgGuiWebComponentLibBoot>;
  }
}
