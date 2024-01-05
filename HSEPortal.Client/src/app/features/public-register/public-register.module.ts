import { NgModule } from "@angular/core";
import { SearchPublicRegisterComponent } from "./search-register/search-register.component";
import { StructureNotFoundComponent } from "./structure-not-found/structure-not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { RouterModule } from "@angular/router";
import { PublicRegisterResultsComponent } from "./results/results.component";
import { StructureDetailsComponent } from "./structure-details/structure-details.component";

const routes = new HseRoutes([
  HseRoute.unsafe(SearchPublicRegisterComponent.route, SearchPublicRegisterComponent, undefined, SearchPublicRegisterComponent.title),
  HseRoute.unsafe(StructureNotFoundComponent.route, StructureNotFoundComponent, undefined, StructureNotFoundComponent.title),
  HseRoute.unsafe(PublicRegisterResultsComponent.route, PublicRegisterResultsComponent, undefined, PublicRegisterResultsComponent.title),
  HseRoute.unsafe(StructureDetailsComponent.route, StructureDetailsComponent, undefined, StructureDetailsComponent.title),
]);

@NgModule({
  declarations: [
    SearchPublicRegisterComponent,
    StructureNotFoundComponent,
    PublicRegisterResultsComponent,
    StructureDetailsComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule
  ],
  exports: [
    SearchPublicRegisterComponent,
    StructureNotFoundComponent
  ],
  providers: [
    ...routes.getProviders()
  ]
})
export class PublicRegisterModule {
  static baseRoute: string = 'public-register';
}