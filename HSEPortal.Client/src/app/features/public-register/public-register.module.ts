import { NgModule } from "@angular/core";
import { SearchPublicRegisterComponent } from "./search-register/search-register.component";
import { StructureNotFoundComponent } from "./structure-not-found/structure-not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { Route, RouterModule } from "@angular/router";
import { PublicRegisterResultsComponent } from "./results/results.component";
import { StructureDetailsComponent } from "./structure-details/structure-details.component";
import { PipesModule } from "../../pipes/pipes.module";
import { PublicRegisterService } from "src/app/services/public-register.service";
import { PasswordAccessComponent } from "./password-access/password-access.component";

const routes = new HseRoutes([
    HseRoute.protected(SearchPublicRegisterComponent.route, SearchPublicRegisterComponent, SearchPublicRegisterComponent.title),
    HseRoute.protected(StructureNotFoundComponent.route, StructureNotFoundComponent, StructureNotFoundComponent.title),
    HseRoute.protected(PublicRegisterResultsComponent.route, PublicRegisterResultsComponent, PublicRegisterResultsComponent.title),
    HseRoute.protected(StructureDetailsComponent.route, StructureDetailsComponent, StructureDetailsComponent.title),
]);

const angRoutes: Route[] = [
    { path: SearchPublicRegisterComponent.route, component: SearchPublicRegisterComponent},
    { path: StructureNotFoundComponent.route, component: StructureNotFoundComponent},
    { path: PublicRegisterResultsComponent.route, component: PublicRegisterResultsComponent},
    { path: StructureDetailsComponent.route, component: StructureDetailsComponent}
];

@NgModule({
    declarations: [
        SearchPublicRegisterComponent,
        StructureNotFoundComponent,
        PublicRegisterResultsComponent,
        StructureDetailsComponent,
        PasswordAccessComponent
    ],
    exports: [
        SearchPublicRegisterComponent,
        StructureNotFoundComponent
    ],
    providers: [
        PublicRegisterService
    ],
    imports: [
        RouterModule.forChild(angRoutes),
        HseAngularModule,
        CommonModule,
        HttpClientModule,
        ComponentsModule,
        PipesModule
    ]
})
export class PublicRegisterModule {
    static baseRoute: string = 'public-register';
}