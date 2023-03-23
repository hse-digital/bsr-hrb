import { ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService } from "../services/application.service";

export class ApHelper {
  static isApAvailable(routeSnapshot: ActivatedRouteSnapshot, applicationService: ApplicationService) {
    var requestedSectionIndex = routeSnapshot.parent?.params["id"];
    if (requestedSectionIndex) {
      let index = Number(requestedSectionIndex.split('-').at(-1)) - 1;
      return applicationService.model.AccountablePersons.length > index;
    }

    return false;
  }

  static isOrganisation(applicationService: ApplicationService) {
    return applicationService.currentAccountablePerson?.Type == "organisation";
  }

  static isIndividual(applicationService: ApplicationService) {
    return applicationService.currentAccountablePerson?.Type == "individual";
  }
}