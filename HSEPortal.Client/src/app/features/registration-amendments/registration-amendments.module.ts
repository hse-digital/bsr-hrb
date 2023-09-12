import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UserListComponent } from './user-list/user-list.component';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { ChangeTaskListComponent } from './change-task-list/change-task-list.component';
import { SelectPrimaryUserComponent } from './select-primary-user/select-primary-user.component';

const routes = new HseRoutes([
  HseRoute.unsafe(ChangeTaskListComponent.route, ChangeTaskListComponent, undefined, ChangeTaskListComponent.title),
  HseRoute.unsafe(UserListComponent.route, UserListComponent, undefined, UserListComponent.title),
  HseRoute.unsafe(SelectPrimaryUserComponent.route, SelectPrimaryUserComponent, undefined, SelectPrimaryUserComponent.title),
]);

@NgModule({
  declarations: [  
    UserListComponent,
    ChangeTaskListComponent,
    SelectPrimaryUserComponent
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
