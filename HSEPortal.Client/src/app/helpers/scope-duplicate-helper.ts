import { ApplicationService } from "../services/application.service";

export class ScopeAndDuplicateHelper {

    public static AreAllSectionsOutOfScope(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Scope?.IsOutOfScope);
    }

    public static AreAllSectionsDuplicated(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Duplicate?.IsDuplicated);
    }

    public static AreAllSectionsRemoved(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Duplicate?.Removed);
    }

}