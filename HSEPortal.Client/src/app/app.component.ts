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
    this.initTimer();
  }

  get headerTitle(): string | undefined {
    return this.headerTitleService.headerTitle;
  }

  async timeoutSaveAndComeBack() {
    await this.applicationService.updateApplication();
    this.showTimeoutDialog = false;
    this.router.navigate(['']);
  }

  timeoutContinue()  { 
    this.showTimeoutDialog = false;
    this.initTimer();
  }

  timeout() {
    this.showTimeoutDialog = false;
    this.applicationService.clearApplication();
    this.router.navigate(['/timeout']);
  }

  initTimer() {
    this.idleTimerService.initTimer(5, () => {
      if (typeof window !== 'undefined' && (this.doesUrlContains("/application/", "/new-application/", "/returning-application"))) {
        this.showTimeoutDialog = true;
      } else {
        this.initTimer();
      }
    });
  }

  private doesUrlContains(...segment: string[]) {
    return segment.filter(x => window.location.href.indexOf(x) > -1).length > 0;
  }
}
