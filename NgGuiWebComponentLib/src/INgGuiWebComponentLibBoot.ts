import type {ApplicationRef} from "@angular/core";

export interface INgGuiWebComponentLibBoot {
  app: ApplicationRef;

  init(): Promise<void>;
}
