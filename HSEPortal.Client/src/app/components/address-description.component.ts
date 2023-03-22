import { Component, Input } from "@angular/core";
import { AddressModel } from "../services/address.service";

@Component({
    selector: 'address-description',
    template: `
        <div *ngIf="address">
            <div>{{getAddressLineOne()}}</div>
            <span *ngIf="address.AddressLineTwo"><div>{{address.AddressLineTwo}}</div></span>
            <div>{{address.Town}}</div>
            <div>{{address.Postcode}}</div>
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
