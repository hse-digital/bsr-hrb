import { AccountablePersonModel, SectionModel } from "../application.service";

export abstract class BaseNavigation {
  abstract getNextRoute(): string;
}

export abstract class BuildingNavigationNode {
  abstract getNextRoute(section: SectionModel): string;
}

export abstract class ApNavigationNode {
  abstract getNextRoute(ap: AccountablePersonModel, apIndex: number): string;
}