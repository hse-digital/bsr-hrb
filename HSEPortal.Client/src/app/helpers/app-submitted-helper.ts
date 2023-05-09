import { ApplicationService, BuildingApplicationStatus } from "src/app/services/application.service";
import { PaymentConfirmationComponent } from "src/app/features/application/payment/payment-confirmation/payment-confirmation.component";
import { NavigationService } from "../services/navigation.service";

export class ApplicationSubmittedHelper {

    public static navigateToPaymentConfirmationIfAppSubmitted(applicationService: ApplicationService, navigationService: NavigationService){
        if (ApplicationSubmittedHelper.isPaymentCompleted(applicationService)) {
            navigationService.navigate(ApplicationSubmittedHelper.getPaymentConfirmationRoute(applicationService));
        }
    } 

    public static isPaymentCompleted(applicationService: ApplicationService){
        return (applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete;
    }

    public static getPaymentConfirmationRoute(applicationService: ApplicationService){
        return `application/${applicationService.model.id}/payment/${PaymentConfirmationComponent.route}`
    }
}