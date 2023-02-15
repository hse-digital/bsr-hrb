import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HseAngularModule } from 'hse-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './features/landing/landing.component';
import { TimeoutComponent } from './features/timeout/timeout.component';
import { ApplicationService } from './services/application.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TimeoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    HseAngularModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
