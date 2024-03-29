import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
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
import { HelpPagesModule } from './components/footer/help-pages.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { KbiService } from './services/kbi.service';
import { GetInjector } from './helpers/injector.helper';
import { WhatWantToDoComponent } from './features/registration-amendments/what-want-to-do/what-want-to-do.component';
import { YesButNoReferenceComponent } from './features/registration-amendments/yes-but-no-reference/yes-but-no-reference';
import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { RegistrationAmendmentsService } from './services/registration-amendments.service';
import { FileUploadService } from './services/file-upload.service';
import { HttpInterceptorService } from './services/http-interceptor';
import { BuildingSummaryNavigation } from './features/application/building-summary/building-summary.navigation';
import { PublicRegisterModule } from './features/public-register/public-register.module';
import { PasswordProtectionComponent } from './features/password-protection/password-protection.component';

const routes = new HseRoutes([
  HseRoute.unsafe(ApplicationSelectorComponent.route, ApplicationSelectorComponent, undefined, ApplicationSelectorComponent.title),
  HseRoute.unsafe(HomeComponent.route, HomeComponent, undefined, HomeComponent.title),
  HseRoute.unsafe(TimeoutComponent.route, TimeoutComponent, undefined, TimeoutComponent.title),
  HseRoute.unsafe(NotFoundComponent.route, NotFoundComponent, undefined, NotFoundComponent.title),
  HseRoute.unsafe(WhatWantToDoComponent.route, WhatWantToDoComponent, undefined, WhatWantToDoComponent.title),
  HseRoute.unsafe(YesButNoReferenceComponent.route, YesButNoReferenceComponent, undefined, YesButNoReferenceComponent.title),
  HseRoute.unsafe(ReturningApplicationComponent.route, ReturningApplicationComponent, undefined, ReturningApplicationComponent.title),
  HseRoute.forLoadChildren(NewApplicationModule.baseRoute, () => import('./features/new-application/new-application.module').then(m => m.NewApplicationModule)),
  HseRoute.forLoadChildren(HelpPagesModule.baseRoute, () => import('./components/footer/help-pages.module').then(m => m.HelpPagesModule)),
  HseRoute.forLoadChildren(ApplicationModule.baseRoute, () => import('./features/application/application.module').then(m => m.ApplicationModule)),
  HseRoute.forLoadChildren(PublicRegisterModule.baseRoute, () => import('./features/public-register/public-register.module').then(m => m.PublicRegisterModule)),
  HseRoute.unsafe(PasswordProtectionComponent.route, PasswordProtectionComponent, undefined, PasswordProtectionComponent.title),
  HseRoute.unsafe('**', undefined, NotFoundComponent.route)
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
    TimeoutModalComponent,
    NotFoundComponent,
    WhatWantToDoComponent,
    YesButNoReferenceComponent,
    PasswordProtectionComponent
  ],
  imports: [
    RouterModule.forRoot(routes.getRoutes(), { initialNavigation: 'enabledBlocking', scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload' }),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    PublicRegisterModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }, 
    HttpClient, 
    ApplicationService, 
    BuildingSummaryNavigation, 
    KbiService, 
    RegistrationAmendmentsService, 
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    GetInjector(injector);
  }
}
