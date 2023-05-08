import { ApplicationService } from "../application.service";

export abstract class BaseNavigation {
  abstract getNextRoute(): string;
}

export abstract class BuildingNavigationNode {
  constructor(public applicationService: ApplicationService) { }

  abstract getNextRoute(): string;

  getCurrentSectionRouteTo(route: string) {
    return `sections/section-${this.applicationService._currentSectionIndex + 1}/${route}`
  }


}