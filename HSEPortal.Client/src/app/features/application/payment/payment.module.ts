import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentDeclarationComponent } from './payment-declaration/payment-declaration.component';

const routes = new HseRoutes([
  HseRoute.protected(PaymentDeclarationComponent.route, PaymentDeclarationComponent, PaymentDeclarationComponent.title),
  HseRoute.protected(PaymentConfirmationComponent.route, PaymentConfirmationComponent, PaymentConfirmationComponent.title),
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
