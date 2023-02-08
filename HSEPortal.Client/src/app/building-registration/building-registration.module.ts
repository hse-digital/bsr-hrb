import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { NewOrExistingRegistrationComponent } from './new-or-existing-registration/new-or-existing-registration.component';
import { CommonModule } from "@angular/common";
import { BuildingRegistrationComponent } from "./building-registration.component";
import { RegistrationSectionsComponent } from "./registration-sections/registration-sections.component";
import { StartComponent } from './start/start.component';
import { HttpClientModule } from "@angular/common/http";
import { BlockRegistrationService } from "../services/building-registration/block-registration.service";
import { BuildingRegistrationService } from "../services/building-registration/building-registration.service";
import { ApplicationCompletedComponent } from "./application-completed/application-completed.component";
import { ContinueSavedApplicationComponent } from './continue-saved-application/continue-saved-application.component';
import { ReturnSecurityComponent } from './return-security/return-security.component';

const routes: Routes = [
  {
    path: '', component: BuildingRegistrationComponent, children: [
      { path: '', component: NewOrExistingRegistrationComponent },
      { path: 'sections', component: RegistrationSectionsComponent },
      { path: 'contact-details', loadChildren: () => import('./contact-details/contact-details.module').then(m => m.ContactDetailsModule) },
      { path: 'building', loadChildren: () => import('./building/building.module').then(m => m.BuildingModule) },
      { path: 'building-completed', component: ApplicationCompletedComponent },
      { path: 'continue-saved-application', component: ContinueSavedApplicationComponent },
      { path: 'return-security', component: ReturnSecurityComponent },
    ]
  },
];

@NgModule({
  declarations: [
    BuildingRegistrationComponent,
    RegistrationSectionsComponent,
    NewOrExistingRegistrationComponent,
    StartComponent,
    ApplicationCompletedComponent,
    ContinueSavedApplicationComponent,
    ReturnSecurityComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    HseAngularModule,
    HttpClientModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    BuildingRegistrationService,
    BlockRegistrationService
  ]
})
export class BuildingRegistrationModule {

}
