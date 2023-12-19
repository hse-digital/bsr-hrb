import { AccountablePersonModel, ApplicationService, BuildingRegistrationVersion, SectionAccountability, Status } from "src/app/services/application.service";
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

    getAccountablePersonListChanges() {
        let changes: (ChangedAnswersModel | undefined)[] = [];

        let original = this.applicationService.previousVersion?.AccountablePersons.map(x => this.getPAPName(x)) ?? [];
        let current = this.applicationService.currentVersion?.AccountablePersons.map(x => this.getPAPName(x)) ?? [];

        changes.push(this.getFieldChange(original, current, "Accountable persons", "Accountable persons", "", "", 0));

        return changes.filter(x => !!x).map(x => x!);
    }

    getPAPChanges(): ChangedAnswersModel[] {
        let original = this.applicationService.previousVersion?.AccountablePersons.at(0) ?? {};
        let current = this.applicationService.currentVersion?.AccountablePersons.at(0) ?? {};
        return this.getPrincipalAccoutablePersonChanges(original, current, 0, this.applicationService.model.BuildingName!).filter(x => !!x).map(x => x!);
    }

    private getPrincipalAccoutablePersonChanges(original: AccountablePersonModel, current: AccountablePersonModel, index: number, sectionName: string) {
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.getPAPName(original), this.getPAPName(current), "Principal accountable person", "Principal accountable person", "", sectionName, index));
        changes.push(this.getFieldChange(this.getNamedContact(original, true), this.getNamedContact(current, true), "Principal accountable person named contact", "Principal accountable person named contact", "", sectionName, index));
        changes.push(this.getFieldChange(original?.NamedContactEmail, current?.NamedContactEmail, "Principal accountable person named contact details", "Principal accountable person named contact details", "", sectionName, index));

        return changes;
    }

    getPAPDetailChanges() {
        let original = this.applicationService.previousVersion?.AccountablePersons.at(0) ?? {};
        let current = this.applicationService.currentVersion?.AccountablePersons.at(0) ?? {};

        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(original?.OrganisationName, current?.OrganisationName, "PAP organisation name", "PAP organisation name", "", "sectionName", 0));
        changes.push(this.getFieldChange(this.getOrgType(original?.OrganisationType), this.getOrgType(current?.OrganisationType), "PAP organisation type", "PAP organisation type", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.Type, current?.Type, "PAP type", "PAP type", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.Email, current?.Email, "PAP Individual email", "PAP Individual email", "", "sectionName", 0));
        changes.push(this.getFieldChange(original?.PhoneNumber, current?.PhoneNumber, "PAP Individual telephone number", "PAP Individual telephone number", "", "sectionName", 0));
        changes.push(this.getAddressChanges([original.PapAddress ?? original.Address!], [current.PapAddress ?? current.Address!], "PAP address", "PAP address", "", "sectionName", 0));

        return changes.filter(x => !!x).map(x => x!);
    }

    getAPDetailChanges() {

        let original = this.applicationService.previousVersion?.AccountablePersons.slice(1);
        let current = this.applicationService.currentVersion?.AccountablePersons.slice(1);

        if (current.length == 0) return [];

        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(...this.getAccountablePersonListChanges());

        for (let index = 0; index < current.length; index++) {
            const currentAP = current[index];
            const originalAP = original.find(x => this.getPAPName(x) == this.getPAPName(currentAP)) ?? undefined;
            if (originalAP == undefined) continue;

            let currentAPName = this.getPAPName(currentAP);

            changes.push(this.getFieldChange(originalAP?.Type, currentAP?.Type, `${currentAPName} AP type`, `${currentAPName} AP type`, "", "sectionName", 0));
            changes.push(this.getFieldChange(this.getOrgType(originalAP?.OrganisationType), this.getOrgType(currentAP?.OrganisationType), `${currentAPName} organisation type`, `${currentAPName} organisation type`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.OrganisationName, currentAP?.OrganisationName, `${currentAPName} organisation name`, `${currentAPName} organisation name`, "", "sectionName", 0));
            changes.push(this.getAddressChanges([originalAP?.Address!], [currentAP?.Address!], `${currentAPName} address`, `${currentAPName} address`, "", "sectionName", 0));
            changes.push(this.getFieldChange(this.getNamedContact(originalAP, false), this.getNamedContact(currentAP, false), `${currentAPName} named contact`, `${currentAPName} named contact`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.NamedContactPhoneNumber, currentAP?.NamedContactPhoneNumber, `${currentAPName} named contact telephone number`, `${currentAPName} named contact telephone number`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.NamedContactEmail, currentAP?.NamedContactEmail, `${currentAPName} named contact email`, `${currentAPName} named contact email`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.LeadEmail, currentAP?.LeadEmail, `${currentAPName} lead contact email`, `${currentAPName} lead contact email`, "", "sectionName", 0));
            changes.push(this.getFieldChange(originalAP?.LeadPhoneNumber, currentAP?.LeadPhoneNumber, `${currentAPName} lead contact telephone number`, `${currentAPName} lead contact telephone number`, "", "sectionName", 0));
            changes.push(this.getFieldChange(`${originalAP?.LeadFirstName} ${currentAP?.LeadLastName}`, `${currentAP?.LeadFirstName} ${currentAP?.LeadLastName}`, `${currentAPName} lead contact telephone number`, `${currentAPName} lead contact telephone number`, "", "sectionName", 0));
            changes.push(this.getAddressChanges([originalAP.PapAddress ?? originalAP.Address!], [currentAP.PapAddress ?? currentAP.Address!], `${currentAPName} address`, `${currentAPName} address`, "", "sectionName", 0));
            // changes.push(this.getAddressChanges([originalAP.Address!], [currentAP.Address!], `${currentAPName} address`, `${currentAPName} address`, "", "sectionName", 0));

        }

        return changes.filter(x => !!x).map(x => x!);
    }

    private getPAPName(pap: AccountablePersonModel) {
        let individualName = pap.IsPrincipal == 'yes' && !FieldValidations.IsNotNullOrWhitespace(pap.FirstName) ? `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}` : `${pap.FirstName} ${pap.LastName}`;
        return pap.Type == 'organisation' ? pap.OrganisationName : individualName;
    }

    private getNamedContact(ap: AccountablePersonModel, isPAP: boolean) {
        if (ap.Type != "organisation") return undefined;

        if ((ap.Role == 'registering_for' || ap.Role == 'employee' || (!FieldValidations.IsNotNullOrWhitespace(ap.NamedContactFirstName) && FieldValidations.IsNotNullOrWhitespace(ap.LeadFirstName)))) {
            return `${ap.LeadFirstName} ${ap.LeadLastName}`;
        } else if (!isPAP && FieldValidations.IsNotNullOrWhitespace(ap.NamedContactFirstName)) {
            return `${ap.NamedContactFirstName} ${ap.NamedContactLastName}`;
        }

        return undefined;
    }

    private getOrgType(value?: string) {
        if (!FieldValidations.IsNotNullOrWhitespace(value)) return "";
        return this.organisationTypeDescription[value!] ?? "";
    }

    private organisationTypeDescription: Record<string, string> = {
        "commonhold-association": "Commonhold association",
        "housing-association": "Registered provider of social housing",
        "local-authority": "Local authority",
        "management-company": "Private registered provider of social housing",
        "rmc-or-organisation": "Resident management company (RMC) or organisation",
        "rtm-or-organisation": "Right to manage (RTM) company or organisation"
    }

    getAreasAccountabilityChanges() {
        let changes: (ChangedAnswersModel | undefined)[] = [];
        let route = "";

        let originalAreasAccountability = this.getAreasAccountability(this.applicationService.previousVersion);
        let currentAreasAccountability = this.getAreasAccountability(this.applicationService.currentVersion);

        currentAreasAccountability.forEach((current, index) => {
            let original = originalAreasAccountability.find(x => x?.title == current?.title);
            changes.push(this.getFieldChange(original?.ap, current?.ap, current?.title ?? "", current?.title ?? "", route, current?.sectionName ?? "", 0));
        });

        return changes.filter(x => !!x).map(x => x!);
    }

    private getAreasAccountability(version: BuildingRegistrationVersion) {
        let areas = ["routes", "maintenance", "facilities"];
        let accountability = [];
        let sections = version.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);
        for (let index = 0; index < sections.length; index++) {
            const section = sections[index];
            for (let index = 0; index < areas.length; index++) {
                const area = areas[index];
                let aps = [];
                for (let index = 0; index < version.AccountablePersons.length; index++) {
                    const accountability = version.AccountablePersons[index].SectionsAccountability;
                    let sectionName = FieldValidations.IsNotNullOrWhitespace(section.Name) ? section.Name : this.applicationService.model.BuildingName;
                    if (!!accountability && accountability.find(x => x.SectionName == sectionName && (x.Accountability?.indexOf(area) ?? -1) > -1)) {
                        aps.push(this.getPAPName(version.AccountablePersons[index]));
                    }
                }
                accountability.push( { title: `${this.areasAccountability[area]} in ${this.transformSectionName(section.Name)}`, ap: aps , sectionName: section.Name} );
            }
        }

        return accountability;
    }

    private transformSectionName(sectionName?: string) {
        if ((!FieldValidations.IsNotNullOrWhitespace(sectionName) || this.applicationService.model.BuildingName == sectionName) && this.applicationService.currentVersion.Sections.length > 1) {
            return this.applicationService.currentVersion.Sections.at(0)?.Name ?? "";
        }
        return sectionName ?? this.applicationService.model.BuildingName;
    }

    private areasAccountability: Record<string, string> = {
        "routes": "Routes that residents can walk through",
        "maintenance": "Maintaining machinery and equipment",
        "facilities": "Facilities that residents share"
    }
}
