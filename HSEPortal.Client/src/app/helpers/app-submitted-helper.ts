import { ApplicationService, BuildingApplicationStage } from "src/app/services/application.service";
import { PaymentConfirmationComponent } from "src/app/features/application/payment/payment-confirmation/payment-confirmation.component";
import { NavigationService } from "../services/navigation.service";
import { ApplicationCompletedComponent } from "../features/application/application-completed/application-completed.component";

export class ApplicationSubmittedHelper {

    public static navigateToPaymentConfirmationIfAppSubmitted(applicationService: ApplicationService, navigationService: NavigationService){
        if (!applicationService.isChangeAmendmentInProgress && ApplicationSubmittedHelper.isPaymentCompleted(applicationService)) {
            navigationService.navigate(ApplicationSubmittedHelper.getPaymentConfirmationRoute(applicationService));
        }
    } 

    public static isPaymentCompleted(applicationService: ApplicationService){
        return (applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete;
    }

    public static isKbiCompleted(applicationService: ApplicationService) {
        return (applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
    }

    public static getPaymentConfirmationRoute(applicationService: ApplicationService){
        return `application/${applicationService.model.id}/payment/${PaymentConfirmationComponent.route}`
    }

    public static getApplicationCompletedRoute(applicationService: ApplicationService) {
        return `application/${applicationService.model.id}/${ApplicationCompletedComponent.route}`;
    }
}