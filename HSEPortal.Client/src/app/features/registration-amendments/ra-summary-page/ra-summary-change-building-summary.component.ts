import { Component, Input } from "@angular/core";
import { Change } from "src/app/services/registration-amendments.service";

@Component({
    selector: 'ra-summary-change-building-summary',
    templateUrl: './ra-summary-change-building-summary.component.html',
    styles: ['.govuk-summary-list__key { width:20%!important; }']
})
export class RaSummaryChangeBuildingSummaryComponent {

    @Input() public changes!: Change[];

    constructor(){ }

    split(value: string) {
        return value.split(',');
    }

}