import { Component } from "@angular/core";
import { BuildingRegistrationService } from "../building-registration.service";

@Component({
    templateUrl: './registration-sections.component.html'
})
export class RegistrationSectionsComponent {

    constructor(private buildingRegistrationService: BuildingRegistrationService){}

    getBuildingName() {
        return this.buildingRegistrationService.buildingRegistrationModel.BuildingName;
    }

    tasks = [
        {
            title: "Prepare your application",
            items: [
                {
                    title: "Blocks in the building",
                    status: 0
                },
                {
                    title: "Principal accountable person",
                    status: 0
                },
                {
                    title: "Other accountable persons",
                    status: 0
                },
            ]
        },
        {
            title: "Submit your application",
            items: [
                {
                    title: "Apply and pay the fee",
                    status: 0
                }
            ]
        }
    ]


}