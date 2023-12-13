import { ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, Status } from "../services/application.service";
import { FieldValidations } from "./validators/fieldvalidations";
import { AccountabilityAreasHelper } from "./accountability-areas-helper";

export class ApHelper {
  static isApAvailable(routeSnapshot: ActivatedRouteSnapshot, applicationService: ApplicationService) {
    var requestedSectionIndex = routeSnapshot.parent?.params["id"];
    if (requestedSectionIndex) {
      let index = Number(requestedSectionIndex.split('-').at(-1)) - 1;
      return applicationService.currentVersion.AccountablePersons.length > index;
    }

    return false;
  }

  static isOrganisation(routeSnapshot: ActivatedRouteSnapshot, applicationService: ApplicationService) {
    var requestedSectionIndex = routeSnapshot.parent?.params["id"];
    if (requestedSectionIndex) {
      let index = Number(requestedSectionIndex.split('-').at(-1)) - 1;
      return applicationService.currentVersion.AccountablePersons[index]?.Type == "organisation";
    }

    return false;
  }

  static isAPValid(applicationService: ApplicationService) {
    let aps = applicationService.currentVersion.AccountablePersons;

    var canContinue = true;
    for (let index = 0; index < aps.length; index++) {
      var ap = aps[index];
      if (ap.Type == "organisation") {
        canContinue &&= (ap.PapAddress ?? ap.Address) != null;
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.OrganisationType);
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.OrganisationName);

        if (index == 0) {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.Role);
        }

        if (ap.Role == "employee" || ap.Role == "registering_for") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadFirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadLastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadJobRole);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadEmail);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadPhoneNumber);
        } else if (ap.Role == "named_contact") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadJobRole);
        }

        if (ap.Role == "registering_for") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.ActingForSameAddress);
          if (ap.ActingForSameAddress == "no") {
            canContinue &&= ap.ActingForAddress != null;
          }
        }

        if (index > 0) {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactFirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactLastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactPhoneNumber);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactEmail);
        }

      } else if (ap.Type == "individual") {
        if (ap.IsPrincipal == "yes") {
          canContinue &&= (ap.PapAddress ?? ap.Address) != null;
        } else {
          canContinue &&= ap.Address != null;
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.FirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.PhoneNumber);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.Email);

          if (index == 0) {
            canContinue &&= ap.PapAddress != null;
          }
        }
      }

      if (index > 0) {
        canContinue &&= (ap.SectionsAccountability?.length ?? 0) > 0;
        canContinue &&= (ap.SectionsAccountability?.findIndex(x => (x.Accountability?.length ?? 0) > 0) ?? -1) > -1;
      }
    }

    canContinue &&= applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed).every(section => AccountabilityAreasHelper.getNotAllocatedAreasOf(applicationService.currentVersion.AccountablePersons, applicationService.model.BuildingName!, section).length == 0);

    return canContinue;
  }
}