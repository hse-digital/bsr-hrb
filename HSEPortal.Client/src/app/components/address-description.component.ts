import { Component, Input } from "@angular/core";
import { AddressModel } from "../services/address.service";

@Component({
    selector: 'address-description',
    template: `
        <div *ngIf="address">
            {{getAddressLineOne()}}
            <br>
            <span *ngIf="address.AddressLineTwo">{{address.AddressLineTwo}}<br></span>
            {{address.Town}}
            <br>
            {{address.Postcode}}
        </div>`
})
export class AddressDescriptionComponent {
    @Input() address?: AddressModel;

    getAddressLineOne() {
        var address = this.address!.Address?.replace(this.address!.Town!, '')!;
        address = address.replace(this.address?.Postcode!, '');

        return address.split(',').filter(x => x.trim().length > 0).join(', ');
    }
}