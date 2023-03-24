import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';

const routes = new HseRoutes([
  HseRoute.unsafe(PrivacyNoticeComponent.route, PrivacyNoticeComponent, undefined, PrivacyNoticeComponent.title),
  HseRoute.unsafe(TermsConditionsComponent.route, TermsConditionsComponent, undefined, TermsConditionsComponent.title),
  HseRoute.unsafe(AccessibilityComponent.route, AccessibilityComponent, undefined, AccessibilityComponent.title),
]);

@NgModule({
  declarations: [
    PrivacyNoticeComponent,
    TermsConditionsComponent,
    AccessibilityComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    CommonModule,
    HseAngularModule,
  ],
  providers: [...routes.getProviders()]
})
export class HelpPagesModule {
  static baseRoute: string = 'help';
}
