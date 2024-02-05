import { NgModule, inject } from "@angular/core";
import { SearchPublicRegisterComponent } from "./search-register/search-register.component";
import { StructureNotFoundComponent } from "./structure-not-found/structure-not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { ActivatedRouteSnapshot, Route, Router, RouterModule, RouterStateSnapshot } from "@angular/router";
import { PublicRegisterResultsComponent } from "./results/results.component";
import { StructureDetailsComponent } from "./structure-details/structure-details.component";
import { PipesModule } from "../../pipes/pipes.module";
import { PublicRegisterService } from "src/app/services/public-register.service";
import { PasswordAccessComponent } from "./password-access/password-access.component";

const publicRegisterGuard = async (_: ActivatedRouteSnapshot, __: RouterStateSnapshot) => {
    var service = inject(PublicRegisterService);
    var router = inject(Router);

    var canAccess = await service.canAccessPublicRegister();
    if (!canAccess) {
        router.navigate(['/public-register/password']);
    }

    return canAccess;
};

const angRoutes: Route[] = [
    { path: SearchPublicRegisterComponent.route, component: SearchPublicRegisterComponent, canActivate: [publicRegisterGuard], title: SearchPublicRegisterComponent.title},
    { path: StructureNotFoundComponent.route, component: StructureNotFoundComponent, canActivate: [publicRegisterGuard], title: StructureNotFoundComponent.title},
    { path: PublicRegisterResultsComponent.route, component: PublicRegisterResultsComponent, canActivate: [publicRegisterGuard], title: PublicRegisterResultsComponent.title},
    { path: StructureDetailsComponent.route, component: StructureDetailsComponent, canActivate: [publicRegisterGuard], title: StructureDetailsComponent.title},
    { path: PasswordAccessComponent.route, component: PasswordAccessComponent },
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