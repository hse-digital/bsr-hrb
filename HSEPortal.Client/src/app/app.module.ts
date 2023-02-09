import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HseAngularModule } from 'hse-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './features/landing/landing.component';
import { TimeoutComponent } from './features/timeout/timeout.component';
import { IdleTimerService } from './services/idle-timer.service';

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
    HseAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router: Router, private idleTimerService: IdleTimerService) {
    this.idleTimerService.initTimer(15 * 60, () => { this.router.navigate(['/building-registration/continue-saved-application']) });
  }
}
