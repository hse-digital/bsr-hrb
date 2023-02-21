import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";

import { ConfirmAddressComponent } from 'src/app/helpers/Components/Address/confirm-address.component';
import { FindAddressComponent } from 'src/app/helpers/Components/Address/find-address.component';
import { ManualAddressComponent } from 'src/app/helpers/Components/Address/manual-address.component';
import { NotFoundAddressComponent } from 'src/app/helpers/Components/Address/not-found-address.component';
import { TooManyAddressComponent } from 'src/app/helpers/Components/Address/too-many-address.component';
import { SelectAddressComponent } from 'src/app/helpers/Components/Address/select-address.component';
import { AddressComponent } from 'src/app/helpers/Components/Address/address.component';
import { AddressService } from "src/app/services/address.service";

@NgModule({
  declarations: [
    AddressComponent,
    ConfirmAddressComponent,
    FindAddressComponent,
    ManualAddressComponent,
    NotFoundAddressComponent,
    TooManyAddressComponent,
    SelectAddressComponent,
  ],
  imports: [
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [
    AddressComponent,
    ConfirmAddressComponent,
    FindAddressComponent,
    ManualAddressComponent,
    NotFoundAddressComponent,
    TooManyAddressComponent,
    SelectAddressComponent,
  ],
  providers: [HttpClient, AddressService]
})
export class AddressModule {

}
