import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from './services/application.service';
import { HeaderTitleService } from './services/headertitle.service';
import { IdleTimerService } from './services/idle-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  showTimeoutDialog = false;

  constructor(private applicationService: ApplicationService,
    private router: Router, private headerTitleService: HeaderTitleService, private idleTimerService: IdleTimerService, private activatedRoute: ActivatedRoute) {
    this.idleTimerService.initTimer(13 * 60, () => {
      if (typeof window !== 'undefined' && window.location.href.indexOf("/application/") > -1) {
        this.showTimeoutDialog = true;
      }
    });
  }

  get headerTitle(): string | undefined {
    return this.headerTitleService.headerTitle;
  }

  async timeoutSaveAndComeBack() {
    await this.applicationService.updateApplication();
    this.showTimeoutDialog = false;
    this.router.navigate(['']);
  }

  timeoutContinue() {
    this.showTimeoutDialog = false;
  }

  timeout() {
    this.showTimeoutDialog = false;
    this.applicationService.clearApplication();
    this.router.navigate(['']);
  }
}
