import { Type } from "@angular/core";
import { LoadChildrenCallback, Route } from "@angular/router";

export class HseRoute implements Route {

  canActivate: Type<any>[] = [];

  private constructor(public path: string, public component?: Type<any> | undefined, public loadChildren?: LoadChildrenCallback) {
  }

  static unsafe(path: string, component: Type<any>): HseRoute {
    return new HseRoute(path, component, undefined);
  }

  static protected(path: string, component: Type<any>) {
    var route = new HseRoute(path, component, undefined);
    route.canActivate = [component];

    return route;
  }

  static forChildren(path: string, loadChildren: LoadChildrenCallback): HseRoute {
    return new HseRoute(path, undefined, loadChildren);
  }
}