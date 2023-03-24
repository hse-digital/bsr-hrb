import { Component } from '@angular/core';

@Component({
  selector: 'hse-privacy-notice',
  templateUrl: './privacy-notice.component.html'
})
export class PrivacyNoticeComponent {
  public static route: string = "privacy-notice";
  static title: string = "Privacy notice - Register a high-rise building - GOV.UK";

  constructor() { }
}
