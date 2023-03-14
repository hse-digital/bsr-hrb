import { Component  } from "@angular/core";

@Component({
    template: `<ap-address [pap]=true />`
})
export class PapAddressComponent {
    static route: string = 'pap-address';
}