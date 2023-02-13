import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "../services/navigation.service";

export interface IHasNextPage {
    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean>;
}