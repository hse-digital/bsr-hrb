import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BacService } from "../application/application-certificate/bac.service";
import { LocalStorage } from "src/app/helpers/local-storage";

@Component({
  templateUrl: './password-protection.component.html'
})
export class PasswordProtectionComponent implements OnInit {
  static route: string = 'password-protected';
  static title: string = 'Protected resources - Register a high-rise building - GOV.UK';

  model?: string;
  returnUrl?: string;
  invalidPasswordError?: string;
  processing = false;
  service?: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private bacService: BacService) {

  }

  ngOnInit(): void {
    this.service = history.state.passwordFeature;
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  async checkPassword() {
    this.processing = true;
    this.invalidPasswordError = undefined;

    var success = await this.bacService.checkPassword(this.model);
    if (success) {
      LocalStorage.setJSON(this.service!, { 'Password': this.model });
      await this.router.navigate([this.returnUrl]);
    } else {
      this.invalidPasswordError = "Invalid password";
    }

    this.processing = false;
  }
}