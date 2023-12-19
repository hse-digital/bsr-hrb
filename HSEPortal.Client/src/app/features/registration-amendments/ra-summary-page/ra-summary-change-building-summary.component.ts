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

    private summaryFields = [
        "Name",
        "number of floors",
        "height",
        "number of residential units",
        "who issued certificate",
        "completion certificate issuer",
        "completion certificate reference",
        "completion certificate file",
        "addresses",
        "built?"
    ];

    private isSummaryChange = (fieldname?: string) => { return this.summaryFields.some(field => fieldname?.trim().endsWith(field))};
    
    get summaryChanges() {
        return this.changes.filter(x => this.isSummaryChange(x.FieldName));
    }

    get connectionChanges() {
        return this.changes.filter(x => x.FieldName?.startsWith("Conn"));
    }

    get kbiChanges() {
        return this.changes.filter(x => !this.isSummaryChange(x.FieldName) && !x.FieldName?.startsWith("Conn"));
    }

}