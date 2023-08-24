import { ApplicationService } from "../services/application.service";

export class ScopeAndDuplicateHelper {

    public static AreAllSectionsOutOfScope(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Scope?.IsOutOfScope);
    }

    public static AreAllSectionsDuplicated(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Duplicate?.IsDuplicated);
    }

    public static AreAllSectionsRemoved(applicationService: ApplicationService): boolean {
        return applicationService.model.Sections.every(x => x.Duplicate?.IncludeStructure == 'no');
    }

    public static ClearOutOfScopeSection(applicationService: ApplicationService, fromHeight: boolean = false, fromUnits: boolean = false) {
        if (fromHeight) {
            applicationService.currentSection.ResidentialUnits = undefined;
        }

        if (fromHeight || fromUnits) {
            applicationService.currentSection.PeopleLivingInBuilding = undefined;
        }

        applicationService.currentSection.YearOfCompletion = undefined;
        applicationService.currentSection.YearOfCompletionOption = undefined;
        applicationService.currentSection.CompletionCertificateIssuer = undefined;
        applicationService.currentSection.CompletionCertificateReference = undefined;
        applicationService.currentSection.Addresses = [];
    }

}