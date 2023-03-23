import { Type } from "@angular/core";
import { LoadChildrenCallback, Route, Routes } from "@angular/router";

export class HseRoute implements Route {

  private _isProtected = false;

  get isProtected() {
    return this._isProtected;
  }

  constructor(public path: string, public component?: Type<any>, public redirectTo?: string, public loadChildren?: LoadChildrenCallback, public title?: string) {
  }

  static unsafe(path: string, component?: Type<any>, redirectTo?: string, title?: string): HseRoute {
    return new HseRoute(path, component, redirectTo, undefined, title);
  }

  static protected(path: string, component: Type<any>, title?: string): HseRoute {
    var hseRoute = new HseRoute(path, component, undefined, undefined, title);
    hseRoute._isProtected = true;
    (<Route>hseRoute).canActivate = [component];

    return hseRoute;
  }

  static forLoadChildren(path: string, loadChildren: LoadChildrenCallback): HseRoute {
    return new HseRoute(path, undefined, undefined, loadChildren);
  }

  static forChildren(path: string, component?: Type<any>, childrenRoutes?: HseRoutes, title?: string): HseRoute {
    var hseRoute = new HseRoute(path, undefined);
    (<Route>hseRoute).children = childrenRoutes!.getRoutes();
    (<Route>hseRoute).component = component;
    (<Route>hseRoute).title = title;

    return hseRoute;
  }
}

export class HseRoutes {

  constructor(public routes: HseRoute[]) { }

  getRoutes(): Routes {
    return this.routes;
  }

  getProviders(): Type<any>[] {
    let providers: any[] = this.routes.filter(r => r.isProtected).map(r => r.component!);
    providers.push(...this.routes.filter(r => (<Route>r).children)
      .flatMap(r => (<Route>r).children!
        .filter(c => (<HseRoute>c).isProtected)
        .map(c => c.component!)
      ));
    return providers;
  }
}
