import { Type } from "@angular/core";
import { LoadChildrenCallback, Route, Routes } from "@angular/router";

export class HseRoute implements Route {

  private _isProtected = false;

  get isProtected() {
    return this._isProtected;
  }

  constructor(public path: string, public component?: Type<any>, public loadChildren?: LoadChildrenCallback) {
  }

  static unsafe(path: string, component: Type<any>): HseRoute {
    return new HseRoute(path, component);
  }

  static protected(path: string, component: Type<any>): HseRoute {
    var hseRoute = new HseRoute(path, component);
    hseRoute._isProtected = true;
    (<Route>hseRoute).canActivate = [component];
    
    return hseRoute;
  }

  static forChildren(path: string, loadChildren: LoadChildrenCallback): HseRoute {
    return new HseRoute(path, undefined, loadChildren);
  }
}

export class HseRoutes {

  constructor(public routes: HseRoute[]) {}

  getRoutes(): Routes {
    return this.routes;
  }

  getProviders(): Type<any>[] {
    return this.routes.filter(r => r.isProtected).map(r => r.component!);
  }
}