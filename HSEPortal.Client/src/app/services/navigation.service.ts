import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) { }

  navigate(route: string): Promise<boolean> {
    return this.router.navigate([route]);
  }

  navigateRelative(subRoute: string, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.router.navigate([`../${subRoute}`], { relativeTo: activatedRoute });
  }

  navigateAppend(subRoute: string, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.router.navigate([subRoute], { relativeTo: activatedRoute });
  }
}
