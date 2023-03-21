import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { RouterModule } from "@angular/router";
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentDeclarationComponent } from './payment-declaration/payment-declaration.component';
import { ComponentsModule } from "src/app/components/components.module";

const routes = new HseRoutes([
  HseRoute.protected(PaymentDeclarationComponent.route, PaymentDeclarationComponent),
  HseRoute.protected(PaymentConfirmationComponent.route, PaymentConfirmationComponent),  
]);

@NgModule({
  declarations: [  
    PaymentConfirmationComponent, PaymentDeclarationComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HttpClient, ...routes.getProviders()]
})
export class PaymentModule {
  public static baseRoute: string = "payment";
}
