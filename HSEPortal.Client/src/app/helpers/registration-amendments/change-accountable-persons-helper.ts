import { AccountablePersonModel, ApplicationService, SectionAccountability } from "src/app/services/application.service";
import { ChangeHelper, ChangedAnswersModel } from "./change-helper";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeAccountablePersonsHelper extends ChangeHelper {

    constructor(private applicationService: ApplicationService) {
        super();
    }

    getAllAPChanges() {
        let buildingSummaryChanges: ChangedAnswersModel[] = [];

        buildingSummaryChanges.push(...this.getPAPChanges());
        buildingSummaryChanges.push(...this.getAreasAccountabilityChanges());
        buildingSummaryChanges.push(...this.getPAPDetailChanges());
        buildingSummaryChanges.push(...this.getAPDetailChanges());
    
        return buildingSummaryChanges.filter(x => !!x).map(x => x!);
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

        return changes;
    }

    getPAPDetailChanges() {
        let original = this.applicationService.previousVersion?.AccountablePersons.at(0) ?? {};
        let current = this.applicationService.currentVersion?.AccountablePersons.at(0) ?? {};

        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(original?.OrganisationName, current?.OrganisationName, "PAP organisation name", "PAP organisation name", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.Type, current?.Type, "PAP type", "PAP type", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.Email, current?.Email, "PAP Individual email", "PAP Individual email", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.PhoneNumber, current?.PhoneNumber, "PAP Individual telephone number", "PAP Individual telephone number", "", "sectionName", 0));
        changes.push(this.getAddressChanges([original.PapAddress!], [current.PapAddress!], "PAP Individual address", "PAP Individual address", "", "sectionName", 0));

        return changes.filter(x => !!x).map(x => x!);;
    }

    getAPDetailChanges() {
        
        let original = this.applicationService.previousVersion?.AccountablePersons.slice(1);
        let current = this.applicationService.currentVersion?.AccountablePersons.slice(1);

        if (current.length > 0) return [];

        let changes: (ChangedAnswersModel | undefined)[] = [];

        for (let index = 0; index < current.length; index++) {
            const originalAP = original.at(index) ?? {};
            const currentAP = current[index];

            let currentAPName = this.getPAPName(currentAP);

            changes.push(this.getFieldChange(originalAP?.Type, currentAP?.Type, `${currentAPName} AP type`, `${currentAPName} AP type`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.OrganisationName, currentAP?.OrganisationName, `${currentAPName} organisation name`, `${currentAPName} organisation name`, "", "sectionName", 0));
            changes.push(this.getAddressChanges([originalAP?.Address!], [currentAP?.Address!], `${currentAPName} address`, `${currentAPName} address`, "", "sectionName", 0));
            changes.push(this.getFieldChange(this.getNamedContact(originalAP), this.getNamedContact(currentAP), `${currentAPName} named contact`, `${currentAPName} named contact`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.NamedContactPhoneNumber, currentAP?.NamedContactPhoneNumber, `${currentAPName} named contact telephone number`, `${currentAPName} named contact telephone number`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.NamedContactEmail, currentAP?.NamedContactEmail, `${currentAPName} named contact email`, `${currentAPName} named contact email`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.LeadEmail, currentAP?.LeadEmail, `${currentAPName} lead contact email`, `${currentAPName} lead contact email`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.LeadPhoneNumber, currentAP?.LeadPhoneNumber, `${currentAPName} lead contact telephone number`, `${currentAPName} lead contact telephone number`, "", "sectionName", 0));
            changes.push(this.getFieldChange(`${originalAP?.LeadFirstName} ${originalAP?.LeadLastName}`, `${currentAP?.LeadFirstName} ${currentAP?.LeadLastName}`, `${currentAPName} lead contact telephone number`, `${currentAPName} lead contact telephone number`, "", "sectionName", 0));
        }

        return changes.filter(x => !!x).map(x => x!);
    }

    private getPAPName(pap: AccountablePersonModel) {
        let individualName = pap.IsPrincipal == 'yes' && !FieldValidations.IsNotNullOrWhitespace(pap.FirstName) ? `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}` : `${pap.FirstName} ${pap.LastName}`;
        return pap.Type == 'organisation' ? pap.OrganisationName : individualName;
    }

    private getNamedContact(pap: AccountablePersonModel) {
        if (!FieldValidations.IsNotNullOrWhitespace(pap.NamedContactFirstName)) return undefined;
        return `${pap.NamedContactFirstName} ${pap.NamedContactLastName}`
    }

    getAreasAccountabilityChanges() {
        let changes: (ChangedAnswersModel | undefined)[] = [];
        let route = "";

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