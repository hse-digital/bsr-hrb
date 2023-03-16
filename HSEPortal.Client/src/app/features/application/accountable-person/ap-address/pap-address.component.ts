import { Component  } from "@angular/core";

@Component({
    template: `<ap-address [pap]=true />`
})
export class PapAddressComponent {
  static route: string = 'pap-address';
  static title: string = "Find the address of the PAP - Register a high-rise building - GOV.UK";
}
