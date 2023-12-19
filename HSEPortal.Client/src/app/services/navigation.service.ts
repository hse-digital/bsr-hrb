import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, QueryParamsHandling, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) { }

  navigate(route: string): Promise<boolean> {
    return this.router.navigate([route]);
  }

  navigateRelative(subRoute: string, activatedRoute: ActivatedRoute, queryParams?: Params, state?: any): Promise<boolean> {
    return this.router.navigate([`../${subRoute}`], { relativeTo: activatedRoute, queryParams: queryParams, state: state });
  }

  navigateAppend(subRoute: string, activatedRoute: ActivatedRoute, queryParams?: Params): Promise<boolean> {
    return this.router.navigate([subRoute], { relativeTo: activatedRoute, queryParams: queryParams });
  }
}
