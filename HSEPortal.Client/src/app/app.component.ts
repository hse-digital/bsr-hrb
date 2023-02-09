import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTitleService } from './services/headertitle.service';
import { IdleTimerService } from './services/idle-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private headerTitleService: HeaderTitleService, private router: Router, private idleTimerService: IdleTimerService) {
    this.idleTimerService.initTimer(15 * 60, () => { this.router.navigate(['/building-registration/continue-saved-application']) });
  }

  get headerTitle(): string | undefined {
    return this.headerTitleService.headerTitle;
  }
}
