import { Component } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  public static route: string = "not-found";
  static title: string = "Not found - Register a high-rise building - GOV.UK";

  returnToApplicationLink = environment.production ? "/" : "/select";

}