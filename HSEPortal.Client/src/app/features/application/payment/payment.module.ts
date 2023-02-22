import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { PaymentService } from "src/app/services/payment.service";
import { PaymentComponent } from "./payment/payment.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { RouterModule } from "@angular/router";
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentDeclarationComponent } from './payment-declaration/payment-declaration.component';

const routes = new HseRoutes([
  HseRoute.unsafe(PaymentDeclarationComponent.route, PaymentDeclarationComponent),
  HseRoute.unsafe(PaymentComponent.route, PaymentComponent),
  HseRoute.unsafe(PaymentConfirmationComponent.route, PaymentConfirmationComponent),  
]);

@NgModule({
  declarations: [  
    PaymentComponent, PaymentConfirmationComponent, PaymentDeclarationComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [HttpClient, PaymentService, ...routes.getProviders()]
})
export class PaymentModule {
  public static baseRoute: string = "payment";
}
