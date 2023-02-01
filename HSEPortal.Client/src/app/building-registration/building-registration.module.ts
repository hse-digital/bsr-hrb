import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { NewOrExistingRegistrationComponent } from './new-or-existing-registration/new-or-existing-registration.component';
import { CommonModule } from "@angular/common";
import { BuildingRegistrationComponent } from "./building-registration.component";
import { RegistrationSectionsComponent } from "./registration-sections/registration-sections.component";
import { StartComponent } from './start/start.component';
import { BuildingRegistrationService } from "./building-registration.service";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [
  {
    path: '', component: BuildingRegistrationComponent, children: [
      { path: '', component: NewOrExistingRegistrationComponent },
      { path: 'sections', component: RegistrationSectionsComponent },
      { path: 'contact-details', loadChildren: () => import('./contact-details/contact-details.module').then(m => m.ContactDetailsModule) },
      { path: 'building', loadChildren: () => import('./building/building.module').then(m => m.BuildingModule) },
    ]
  },
];

@NgModule({
  declarations: [
    BuildingRegistrationComponent,
    RegistrationSectionsComponent,
    NewOrExistingRegistrationComponent,
    StartComponent,
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
    BuildingRegistrationService
  ]
})
export class BuildingRegistrationModule {

}
