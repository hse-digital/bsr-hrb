import { SectionModel } from "../application.service";

export abstract class BaseNavigation {
  abstract getNextRoute(): string;
}

export abstract class BuildingNavigationNode {
  abstract getNextRoute(section: SectionModel): string;
}