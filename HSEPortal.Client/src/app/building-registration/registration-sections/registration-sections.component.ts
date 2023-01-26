import { Component } from "@angular/core";

@Component({
    templateUrl: './registration-sections.component.html'
})
export class RegistrationSectionsComponent {

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