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
        StructureDetailsComponent
    ],
    exports: [
        SearchPublicRegisterComponent,
        StructureNotFoundComponent
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