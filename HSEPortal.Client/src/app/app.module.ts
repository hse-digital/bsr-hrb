import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HseAngularModule } from 'hse-angular';

import { AppComponent } from './app.component';
import { ReturningApplicationComponent } from './features/returning-application/returning-application.component';
import { ApplicationSelectorComponent } from './features/application-selector/application-selector.component';
import { HomeComponent } from './features/home/home.component';
import { TimeoutComponent } from './features/timeout/timeout.component';
import { ApplicationService } from './services/application.service';
import { HseRoute, HseRoutes } from './services/hse.route';
import { NewApplicationModule } from './features/new-application/new-application.module';
import { ReturningApplicationEnterDataComponent } from './features/returning-application/enterdata.component';
import { ReturningApplicationResendCodeComponent } from './features/returning-application/resend.component';
import { ReturningApplicationVerifyComponent } from './features/returning-application/verify.component';
import { ApplicationModule } from './features/application/application.module';
import { TimeoutModalComponent } from './features/timeout/timeout.modal';

const routes = new HseRoutes([
  HseRoute.unsafe(HomeComponent.route, HomeComponent),
  HseRoute.unsafe(TimeoutComponent.route, TimeoutComponent),
  HseRoute.unsafe(ApplicationSelectorComponent.route, ApplicationSelectorComponent),
  HseRoute.unsafe(ReturningApplicationComponent.route, ReturningApplicationComponent),
  HseRoute.forLoadChildren(NewApplicationModule.baseRoute, () => import('./features/new-application/new-application.module').then(m => m.NewApplicationModule)),
  HseRoute.forLoadChildren(ApplicationModule.baseRoute, () => import('./features/application/application.module').then(m => m.ApplicationModule)),
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimeoutComponent,
    ApplicationSelectorComponent,
    ReturningApplicationComponent,
    ReturningApplicationEnterDataComponent,
    ReturningApplicationResendCodeComponent,
    ReturningApplicationVerifyComponent,
    TimeoutModalComponent
  ],
  imports: [
    RouterModule.forRoot(routes.getRoutes(), { initialNavigation: 'enabledBlocking' }),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HseAngularModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
