import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { ApplicationService } from "src/app/services/application.service";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { NumberOfSectionsComponment } from "./number-of-sections/number-of-sections.component";
import { ContinueAnywayComponent } from "./out-of-scope/continue-anyway.component";
import { BuildingOutOfScopeComponent } from "./out-of-scope/out-of-scope.component";
import { PaymentModule } from "./payment/payment.module";
import { SectionsModule } from "./sections/sections.module";
import { ApplicationTaskListComponent } from "./task-list/task-list.component";

const routes = new HseRoutes([
    HseRoute.protected(ApplicationTaskListComponent.route, ApplicationTaskListComponent, ApplicationTaskListComponent.title),
    HseRoute.protected(NumberOfSectionsComponment.route, NumberOfSectionsComponment, NumberOfSectionsComponment.title),
    HseRoute.protected(BuildingOutOfScopeComponent.route, BuildingOutOfScopeComponent, BuildingOutOfScopeComponent.title),
    HseRoute.protected(ContinueAnywayComponent.route, ContinueAnywayComponent, ContinueAnywayComponent.title),
    HseRoute.forLoadChildren(SectionsModule.baseRoute, () => import('./sections/sections.module').then(m => m.SectionsModule)),
    HseRoute.forLoadChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
    HseRoute.forLoadChildren(PaymentModule.baseRoute, () => import('./payment/payment.module').then(m => m.PaymentModule)),
]);

@NgModule({
    declarations: [
        ApplicationTaskListComponent,
        ApplicationCompletedComponent,
        NumberOfSectionsComponment,
        BuildingOutOfScopeComponent,
        ContinueAnywayComponent,
    ],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        ComponentsModule,
        CommonModule,
        HttpClientModule
    ],
    providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class ApplicationModule {
    static baseRoute: string = 'application/:id';
}
