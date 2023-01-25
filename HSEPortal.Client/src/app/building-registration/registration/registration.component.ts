import { Component, OnInit } from "@angular/core";
import { HeaderTitleService } from "src/app/services/headertitle.service";

@Component({
    selector: 'hse-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

    constructor(private headerTitleService: HeaderTitleService) {
        this.headerTitleService.headerTitle = 'Register a high-rise building';
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