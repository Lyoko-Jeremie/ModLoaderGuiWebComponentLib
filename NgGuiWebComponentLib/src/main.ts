import {ApplicationRef, importProvidersFrom, NgZone, Type} from "@angular/core";
import {createCustomElement, NgElementConstructor} from '@angular/elements';
import {createApplication} from '@angular/platform-browser';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app/app.component';
import {BeautySelectorAddonComponent} from "./beauty-selector-addon/beauty-selector-addon.component";
import {GuiWebComponentLibRefService} from "./GuiWebComponentLibRef/gui-web-component-lib-ref.service";

function addNewWebComponent<ComponentClassType>(
  app: ApplicationRef,
  ComponentClass: Type<ComponentClassType>,
  webComponentName: string,
): NgElementConstructor<ComponentClassType> {
// BeautySelectorAddon

  const webComponentElement = createCustomElement<ComponentClassType>(ComponentClass, {
    injector: app.injector,
  });
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names
  customElements.define(webComponentName, webComponentElement);

  return webComponentElement;
}

export class NgGuiWebComponentLibBoot {
  app!: ApplicationRef;

  constructor() {
  }

  async init() {
    this.app = await createApplication({
      providers: [
        {provide: GuiWebComponentLibRefService},
        importProvidersFrom(SweetAlert2Module.forRoot()),
      ],
    });
    // this.app.injector.get(NgZone).run(() => {
    //   // app.bootstrap(TestWcComponent, 'ag-el-test-WebComponent-1');
    //   // app.bootstrap(TestWcComponent, 'ag-el-test-WebComponent-2');
    // });
    addNewWebComponent(this.app, AppComponent, 'ng-gui-web-component-lib-app-component');

    addNewWebComponent(this.app, BeautySelectorAddonComponent, 'ng-gui-web-component-lib-beauty-selector-addon');
  }
}

window.modNgGuiWebComponentLibBootstrapFactory = async () => {
  if (!window.modNgGuiWebComponentLib) {
    window.modNgGuiWebComponentLib = new NgGuiWebComponentLibBoot();
  }
  return window.modNgGuiWebComponentLib;
}
;(async () => {

  // await window.modNgGuiWebComponentLib.init();

  // const r = document.createElement('ag-el-test-web-component');
  // document.body.appendChild(r);
  // r.addEventListener('change', (event) => {
  //   console.log('change', event);
  //   console.log(r.a);
  //   console.log(r.b);
  //   r.b = (event as CustomEvent<boolean>).detail ? 2 : 3;
  // });
})();
