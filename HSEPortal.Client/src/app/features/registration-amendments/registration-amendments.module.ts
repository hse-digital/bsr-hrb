import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UserListComponent } from './change-applicant/user-list/user-list.component';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { ChangeTaskListComponent } from './change-task-list/change-task-list.component';
import { SelectPrimaryUserComponent } from './change-applicant/select-primary-user/select-primary-user.component';
import { PrimaryUserDetailsComponent } from './change-applicant/primary-user-details/primary-user-details.component';
import { ConfirmPrimaryUserComponent } from './change-applicant/confirm-primary-user/confirm-primary-user.component';
import { SelectSecondaryUserComponent } from './change-applicant/select-secondary-user/select-secondary-user.component';
import { SecondaryUserDetailsComponent } from './change-applicant/secondary-user-details/secondary-user-details.component';
import { ConfirmSecondaryUserComponent } from './change-applicant/confirm-secondary-user/confirm-secondary-user.component';
import { RemoveSecondaryUserComponent } from './change-applicant/remove-secondary-user/remove-secondary-user.component';
import { RaDeclarationComponent } from './ra-declaration/ra-declaration.component';
import { KeepSecondaryUserComponent } from './change-applicant/keep-secondary-user/keep-secondary-user.component';
import { RaConfirmationComponent } from './ra-confirmation/ra-confirmation.component';
import { RaCheckAnswersComponent } from './ra-check-answers/ra-check-answers.component';
import { RaSummaryPageComponent } from './ra-summary-page/ra-summary-page.component';
import { RaSummaryChangeApplicantComponent } from './ra-summary-page/ra-summary-change-applicant.component';

const routes = new HseRoutes([
  HseRoute.protected(ChangeTaskListComponent.route, ChangeTaskListComponent, ChangeTaskListComponent.title),
  HseRoute.protected(UserListComponent.route, UserListComponent, UserListComponent.title),
  HseRoute.protected(SelectPrimaryUserComponent.route, SelectPrimaryUserComponent, SelectPrimaryUserComponent.title),
  HseRoute.protected(PrimaryUserDetailsComponent.route, PrimaryUserDetailsComponent, PrimaryUserDetailsComponent.title),
  HseRoute.protected(ConfirmPrimaryUserComponent.route, ConfirmPrimaryUserComponent, ConfirmPrimaryUserComponent.title),
  HseRoute.protected(SelectSecondaryUserComponent.route, SelectSecondaryUserComponent, SelectSecondaryUserComponent.title),
  HseRoute.protected(SecondaryUserDetailsComponent.route, SecondaryUserDetailsComponent, SecondaryUserDetailsComponent.title),
  HseRoute.protected(ConfirmSecondaryUserComponent.route, ConfirmSecondaryUserComponent, ConfirmSecondaryUserComponent.title),
  HseRoute.protected(RemoveSecondaryUserComponent.route, RemoveSecondaryUserComponent, RemoveSecondaryUserComponent.title),
  HseRoute.protected(KeepSecondaryUserComponent.route, KeepSecondaryUserComponent, KeepSecondaryUserComponent.title),
  HseRoute.protected(RaDeclarationComponent.route, RaDeclarationComponent, RaDeclarationComponent.title),
  HseRoute.protected(RaConfirmationComponent.route, RaConfirmationComponent, RaConfirmationComponent.title),
  HseRoute.protected(RaCheckAnswersComponent.route, RaCheckAnswersComponent, RaCheckAnswersComponent.title),
  HseRoute.protected(RaSummaryPageComponent.route, RaSummaryPageComponent, RaSummaryPageComponent.title),
]);

@NgModule({
  declarations: [  
    UserListComponent,
    ChangeTaskListComponent,
    SelectPrimaryUserComponent,
    PrimaryUserDetailsComponent,
    ConfirmPrimaryUserComponent,
    SelectSecondaryUserComponent,
    ConfirmSecondaryUserComponent,
    SecondaryUserDetailsComponent,
    RemoveSecondaryUserComponent,
    RaDeclarationComponent,
    KeepSecondaryUserComponent,
    RaConfirmationComponent,
    RaCheckAnswersComponent,
    RaSummaryPageComponent,
    RaSummaryChangeApplicantComponent
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
export class RegistrationAmendmentsModule {
  static baseRoute: string = "registration-amendments";
}
