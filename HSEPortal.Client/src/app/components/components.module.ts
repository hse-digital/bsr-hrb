import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";

import { AddressComponent } from "./address/address.component";
import { ConfirmAddressComponent } from "./address/confirm-address.component";
import { FindAddressComponent } from "./address/find-address.component";
import { AddressService } from "src/app/services/address.service";
import { ManualAddressComponent } from "./address/manual-address.component";
import { NotFoundAddressComponent } from "./address/not-found-address.component";
import { SelectAddressComponent } from "./address/select-address.component";
import { TooManyAddressComponent } from "./address/too-many-address.component";
import { AddressDescriptionComponent } from "./address-description.component";
import { SaveAndComeBackLaterComponent } from "./save-and-come-back.component";
import { PapAccountabilityComponent } from "./pap-accountability/pap-accountability.component";
import { GovukRequiredDirective } from "./required.directive";
import { AccountabilityComponent } from './accountability/accountability.component';
import { NotAllocatedAccountabilityComponent } from './not-allocated-accountability/not-allocated-accountability.component';

@NgModule({
  declarations: [
    AddressComponent,
    ConfirmAddressComponent,
    FindAddressComponent,
    ManualAddressComponent,
    NotFoundAddressComponent,
    TooManyAddressComponent,
    SelectAddressComponent,
    AddressDescriptionComponent,
    SaveAndComeBackLaterComponent,
    PapAccountabilityComponent,
    GovukRequiredDirective,
    AccountabilityComponent,
    NotAllocatedAccountabilityComponent
  ],
  imports: [
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [
    AddressComponent,
    AddressDescriptionComponent,
    SaveAndComeBackLaterComponent,
    PapAccountabilityComponent,
    GovukRequiredDirective,
    AccountabilityComponent,
    NotAllocatedAccountabilityComponent
  ],
  providers: [HttpClient, AddressService]
})
export class ComponentsModule {

}
