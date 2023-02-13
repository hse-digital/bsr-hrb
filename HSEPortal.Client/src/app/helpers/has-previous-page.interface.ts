import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "../services/navigation.service";

export interface IHasPreviousPage {
    navigateToPreviousPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean>;
}