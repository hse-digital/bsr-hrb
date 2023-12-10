import { AccountablePersonModel, ApplicationService, SectionAccountability } from "src/app/services/application.service";
import { ChangeHelper, ChangedAnswersModel } from "./change-helper";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeAccountablePersonsHelper extends ChangeHelper {

    constructor(private applicationService: ApplicationService) {
        super();
    }

    getPAPChanges(): ChangedAnswersModel[] {
        let original = this.applicationService.previousVersion?.AccountablePersons.at(0) ?? {};
        let current = this.applicationService.currentVersion?.AccountablePersons.at(0) ?? {};
        return this.getPrincipalAccoutablePersonChanges(original, current, 0, this.applicationService.model.BuildingName!).filter(x => !!x).map(x => x!);
    }

    private getPrincipalAccoutablePersonChanges(original: AccountablePersonModel, current: AccountablePersonModel, index: number, sectionName: string) {
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.getPAPName(original), this.getPAPName(current), "Principal accountable person", "Principal accountable person", "", sectionName, index));
        changes.push(this.getFieldChange(this.getNamedContact(original), this.getNamedContact(current), "Principal accountable person named contact", "Principal accountable person named contact", "", sectionName, index));
      changes.push(this.getFieldChange(original?.NamedContactEmail, current?.NamedContactEmail, "Principal accountable person named contact details", "Principal accountable person named contact details", "", sectionName, index));
        //displaying pap address changes
        changes.push(this.getFieldChange(this.getPAPAddress(original), this.getPAPAddress(current), "Principal accountable address details", "Principal accountable person address details", "", sectionName, index));
        return changes;
    }

    private getPAPName(pap: AccountablePersonModel) {
        let individualName = pap.IsPrincipal == 'yes' && !FieldValidations.IsNotNullOrWhitespace(pap.FirstName) ? `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}` : `${pap.FirstName} ${pap.LastName}`;
        return pap.Type == 'organisation' ? pap.OrganisationName : individualName;
    }

    //added get pap address method
    private getPAPAddress(pap: AccountablePersonModel) {
      return pap.PapAddress?.Address ?? pap.Address?.Address;
    }

    private getNamedContact(pap: AccountablePersonModel) {
        if (!FieldValidations.IsNotNullOrWhitespace(pap.NamedContactFirstName)) return undefined;
        return `${pap.NamedContactFirstName} ${pap.NamedContactLastName}`
    }

    getAreasAccountabilityChanges() {
        let changes: (ChangedAnswersModel | undefined)[] = [];
        let route = "";

        this.applicationService.currentVersion?.AccountablePersons

        let originalAP = this.applicationService.previousVersion?.AccountablePersons.at(0) ?? {};
        let currentAP = this.applicationService.currentVersion?.AccountablePersons.at(0) ?? {};

        let originalAreasAccountability = this.getAreasAccountability(originalAP.SectionsAccountability, this.getPAPName(originalAP));
        let currentAreasAccountability = this.getAreasAccountability(currentAP.SectionsAccountability, this.getPAPName(currentAP));

        currentAreasAccountability.forEach((current, index) => {
            let original = originalAreasAccountability.find(x => x?.title == current?.title);
            changes.push(this.getFieldChange(original?.ap, current?.ap, current?.title ?? "", current?.title ?? "", route, current?.sectionName ?? "", 0));
        });

        return changes.filter(x => !!x).map(x => x!);
    }

    private getAreasAccountability(SectionsAccountability?: SectionAccountability[], ap?: string) {
        return SectionsAccountability?.flatMap(x => x.Accountability?.map(area => { 
            return { title: `${this.areasAccountability[area]} in ${x.SectionName}`, ap: ap , sectionName: x.SectionName} 
        })) ?? [];
    }

    private areasAccountability: Record<string, string> = {
        "routes": "Routes that residents can walk through",
        "maintenance": "Maintaining machinery and equipment",
        "facilities": "Facilities that residents share"
    }
}
