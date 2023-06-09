import { AccountablePersonModel, KbiModel, KbiSectionModel, SectionModel } from "./application.service";

export abstract class BaseNavigation {
  abstract getNextRoute(): string;
}

export abstract class BuildingNavigationNode {
  abstract getNextRoute(section: SectionModel, sectionIndex: number): string;
}

export abstract class ApNavigationNode {
  abstract getNextRoute(ap: AccountablePersonModel, apIndex: number): string;
}

export abstract class KbiNavigationNode {
  abstract getNextRoute(kbi: KbiSectionModel | KbiModel, kbiSectionIndex: number ): string;
}