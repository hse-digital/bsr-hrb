import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from './services/application.service';
import { HeaderTitleService } from './services/headertitle.service';
import { IdleTimerService } from './services/idle-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private headerTitleService: HeaderTitleService, private applicationService: ApplicationService, private router: Router, private idleTimerService: IdleTimerService) {
    this.idleTimerService.initTimer(15 * 60, () => { 
      this.applicationService.newApplication();
      this.router.navigate(['/application/continue']);
    });
  }

  get headerTitle(): string | undefined {
    return this.headerTitleService.headerTitle;
  }
}
