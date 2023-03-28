import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from './services/application.service';
import { HeaderTitleService } from './services/headertitle.service';
import { IdleTimerService } from './services/idle-timer.service';
import { CookiesBannerService } from './services/cookies-banner.service';
import { GovukCookieBannerComponent } from 'hse-angular';
import { HelpPagesModule } from './features/footer/help-pages.module';
import { NavigationService } from './services/navigation.service';
import { CookiesComponent } from './features/footer/cookies/cookies.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [CookiesBannerService]
})
export class AppComponent implements AfterViewInit {

  showTimeoutDialog = false;
  footerLinks = HelpPagesModule.footerLinks;
  viewCookiesLink!: string;

  constructor(private applicationService: ApplicationService,
    private router: Router, private headerTitleService: HeaderTitleService, private idleTimerService: IdleTimerService, private activatedRoute: ActivatedRoute, private cookiesBannerService: CookiesBannerService, private navigationService: NavigationService) {
    this.initTimer();
    this.initCookiesBanner();
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
    this.initTimer();
  }

  timeout() {
    this.showTimeoutDialog = false;
    this.applicationService.clearApplication();
    this.router.navigate(['/timeout']);
  }

  initTimer() {
    this.idleTimerService.initTimer(13 * 60, () => {
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

  @ViewChild(GovukCookieBannerComponent) cookieBanner?: GovukCookieBannerComponent;
  ngAfterViewInit(): void {
    this.cookieBanner?.onHideCookieBannerConfirmation.subscribe(() => {
      if (typeof window !== 'undefined') {
        window.location.href = window.location.href;
      }
    })
  }

  showCookieBanner: boolean = true;
  initCookiesBanner() {
    this.showCookieBanner = this.cookiesBannerService.getShowCookiesStatus();
    this.viewCookiesLink = `/${HelpPagesModule.baseRoute}/${CookiesComponent.route}`;
  }

  cookiesAccepted() {
    this.cookiesBannerService.acceptCookies();
    this.showCookieBanner = this.cookiesBannerService.getShowCookiesStatus();
  }

  cookiesRejected() {
    this.cookiesBannerService.rejectCookies();
    this.showCookieBanner = this.cookiesBannerService.getShowCookiesStatus();
  }

  async cookiesChanged() {
    await this.navigationService.navigate(`/${HelpPagesModule.baseRoute}/${CookiesComponent.route}`);
    this.cookieBanner?.hideCookieBannerConfirmation();
  }
}
