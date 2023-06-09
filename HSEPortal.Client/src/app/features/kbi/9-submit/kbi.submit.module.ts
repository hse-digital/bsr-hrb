import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { DeclarationComponent } from './declaration/declaration.component';
import { ConfirmComponent } from './confirm/confirm.component';

const routes = new HseRoutes([
  HseRoute.protected(DeclarationComponent.route, DeclarationComponent, DeclarationComponent.title),
  HseRoute.protected(ConfirmComponent.route, ConfirmComponent, ConfirmComponent.title),
]);

@NgModule({
  declarations: [
    DeclarationComponent,
    ConfirmComponent
  ],
  providers: [HttpClient, ...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
  ]

})
export class KbiSubmitModule {
  static baseRoute: string = 'submit';
}