import { Component } from "@angular/core";
import { BuildingRegistrationService } from "src/app/services/building-registration.service";

@Component({
    templateUrl: './sections.component.html'
})
export class ApplicationsSectionsComponent {
    static route: string = 'sections';

    constructor(private buildingRegistrationService: BuildingRegistrationService){}

    getBuildingName() {
        return this.buildingRegistrationService.model.BuildingName;
    }

    tasks = [
        {
            title: "Prepare your application",
            items: [
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
