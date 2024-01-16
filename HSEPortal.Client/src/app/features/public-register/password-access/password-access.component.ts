import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorage } from "src/app/helpers/local-storage";
import { PublicRegisterService } from "src/app/services/public-register.service";

@Component({
  templateUrl: './password-access.component.html'
})
export class PasswordAccessComponent {
  public static title: string = 'Password Access - Register a high-rise building - GOV.UK';
  public static route: string = 'password';

  password?: string;
  errorMessage?: string;
  processing: boolean = false;

  constructor(private service: PublicRegisterService, private router: Router) { }

  async continue() {
    this.processing = true;

    var isPasswordCorrect = await this.service.validatePublicRegisterPassword(this.password);
    if (isPasswordCorrect) {
      LocalStorage.setJSON('PublicRegister', { 'Password': this.password });
      this.router.navigate(['/public-register/search']);
    } else {
      this.errorMessage = 'Invalid password';
      this.processing = false;
    }
  }
}