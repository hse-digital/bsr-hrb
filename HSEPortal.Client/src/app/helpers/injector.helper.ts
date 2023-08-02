import { Injector } from "@angular/core";

let appInjector: Injector;
export const GetInjector = (injector?: Injector): Injector => {
    if (injector) {
      appInjector = injector;
    }

    return appInjector;
}