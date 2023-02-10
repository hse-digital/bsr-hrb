import { Type } from "@angular/core";
import { LoadChildrenCallback, Route } from "@angular/router";

export class HseRoute {

  static unsafe(path: string, component: Type<any>): Route {
    return {
      path: path,
      component: component
    }
  }

  static protected(path: string, component: Type<any>): Route {
    return {
      path: path,
      component: component,
      canActivate: [component]
    };
  }

  static forChildren(path: string, loadChildren: LoadChildrenCallback): Route {
    return {
      path: path,
      loadChildren: loadChildren
    };
  }
}