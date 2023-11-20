import { AddressModel } from "src/app/services/address.service";
import { SectionModel, ApplicationService, Status } from "src/app/services/application.service";
import { FieldValidations } from "../validators/fieldvalidations";

export type BuildingSummaryChangeModel = {
    SectionName?: string,
    SectionIndex?: number,
    OldValue?: any,
    NewValue?: any,
    Title?: string,
    Field?: string,
    Route?: string,
    IsAddress?: boolean,
    OldAddresses?: AddressModel[],
    NewAddresses?: AddressModel[]
}

export class ChangeBuildingSummaryHelper {

    private _buildingSummaryChanges: BuildingSummaryChanges;
    private _buildingSummaryInformationGetter: BuildingSummaryInformationGetter;

    constructor(private applicationService: ApplicationService) { 
        this._buildingSummaryChanges = new BuildingSummaryChanges(this.applicationService);
        this._buildingSummaryInformationGetter = new BuildingSummaryInformationGetter(this.applicationService);
    }

    getChanges(): BuildingSummaryChangeModel[] {
        return this._buildingSummaryChanges.getChanges(
            this._buildingSummaryInformationGetter.getPreviousSectionNames(),
            this._buildingSummaryInformationGetter.getCurrentSectionNames()
        );
    }

    getRemovedStructures() {
        return this._buildingSummaryInformationGetter.getRemovedStructures();
    }
}

class BuildingSummaryChanges {

    constructor (private applicationService: ApplicationService) { }

    getChanges(previousSectionNames: string[], currentSectionNames: string[]): BuildingSummaryChangeModel[] {
        let previousVersion = this.applicationService.previousVersion;
        let changes = this.applicationService.currentVersion.Sections.flatMap((section, index) => {
            if (section.Status == Status.Removed) return undefined;
            let originalSection = previousVersion!.Sections.length <= index ? new SectionModel() : previousVersion!.Sections[index];
            return this.getSectionChanges(originalSection, section, index);
        }).filter(x => !!x).map(x => x!);

        if (!BuildingSummaryComparator.areBuildingsEqual(previousVersion.Sections, this.applicationService.currentVersion.Sections)) {
            changes.push(this.getFieldChange(previousSectionNames, currentSectionNames, "Structures", "Structures", "building-change-check-answers", "", -1)!);
        }

        return changes;
    }

    private getSectionChanges(originalSection: SectionModel, currentSection: SectionModel, sectionIndex: number): BuildingSummaryChangeModel[] {
        if (!originalSection || !originalSection.Addresses || originalSection.Addresses.length == 0) return [];
        let sectionName = this.getLatestValueOf(originalSection.Name, currentSection.Name) ?? this.applicationService.model.BuildingName!;
        let changes: (BuildingSummaryChangeModel | undefined)[] = [];
        changes.push(this.getFieldChange(originalSection.Name, currentSection.Name, "Name", "Name", "name", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.FloorsAbove, currentSection.FloorsAbove, "Number of floors", sectionName + " number of floors", "floors", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.Height, currentSection.Height, "Height", sectionName + " height", "height", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.ResidentialUnits, currentSection.ResidentialUnits, "Residential units", sectionName + " number of residential units", "residential-units", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.WhoIssuedCertificate, currentSection.WhoIssuedCertificate, "Who issued certificate", sectionName + " who issued certificate", "certificate-issuer", sectionName, sectionIndex));

        changes.push(this.getYearOfCompletion(originalSection, currentSection, sectionName, sectionIndex))

        changes.push(this.getFieldChange(originalSection.CompletionCertificateIssuer, currentSection.CompletionCertificateIssuer, "Completion certificate issuer", sectionName + " completion certificate issuer", "certificate-issuer", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.CompletionCertificateReference, currentSection.CompletionCertificateReference, "Completion certificate reference", sectionName + " completion certificate reference", "certificate-number", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.CompletionCertificateFile?.Filename, currentSection.CompletionCertificateFile?.Filename, "Completion certificate file", sectionName + " completion certificate file", "upload-completion-certificate", sectionName, sectionIndex));
        changes.push(this.getSectionAddressChanges(originalSection.Addresses, currentSection.Addresses, "Addresses", sectionName + " addresses", "building-change-check-answers", sectionName, sectionIndex));
        return changes.filter(x => !!x && x != undefined).map(x => x!);
    }

    private getYearOfCompletion(originalSection: SectionModel, currentSection: SectionModel, sectionName: string, sectionIndex: number) {
        let currentYear = currentSection.YearOfCompletionOption == "year-exact" ? currentSection.YearOfCompletion : currentSection.YearOfCompletionRange;
        let originalYear = originalSection.YearOfCompletionOption == "year-exact" ? originalSection.YearOfCompletion : originalSection.YearOfCompletionRange;
        return this.getFieldChange(originalYear, currentYear, "Year of completion", "When was " + sectionName + " built?", "year-of-completion", sectionName, sectionIndex);
    }

    private getFieldChange(field: any, changedfield: any, fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): BuildingSummaryChangeModel | undefined {
        return this.hasChanged(field, changedfield) ? {
            Title: title,
            Field: fieldName,
            NewValue: changedfield,
            OldValue: field,
            Route: route,
            SectionName: sectionName,
            SectionIndex: sectionIndex,
            IsAddress: false
        } : undefined;
    }

    private getSectionAddressChanges(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[], fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): BuildingSummaryChangeModel | undefined {
        if (!SectionAddresses || SectionAddresses.length == 0 || SectionAddresses.every(x => x == null || x == undefined)) return undefined;
        if (!ChangeSectionAddresses || ChangeSectionAddresses.length == 0 || ChangeSectionAddresses.every(x => x == null || x == undefined)) return undefined;

        let hasAddressesChanged = SectionAddresses.length != ChangeSectionAddresses.length;
        if (!hasAddressesChanged) hasAddressesChanged = this.hasAddressChanged(SectionAddresses, ChangeSectionAddresses);

        return hasAddressesChanged ? {
            Title: title,
            Field: fieldName,
            NewAddresses: ChangeSectionAddresses,
            OldAddresses: SectionAddresses,
            Route: route,
            SectionName: sectionName,
            SectionIndex: sectionIndex,
            IsAddress: true
        } : undefined;
    }

    private getLatestValueOf(field?: any, changedField?: any) {
        let hasChanged = this.hasChanged(field, changedField);
        return hasChanged ? changedField : field;
    }

    private hasChanged(field?: any, changedField?: any) {
        let hasNewValue = typeof changedField == "string" ? FieldValidations.IsNotNullOrWhitespace(changedField) : changedField != undefined;
        return hasNewValue && field != changedField;
    }

    private hasAddressChanged(CurrentAddresses: AddressModel[], OriginalAddresses: AddressModel[]) { 
        return CurrentAddresses.map(address => address.Postcode).some(current => {
            return OriginalAddresses.map(original => original.Postcode).findIndex(original => original == current) == -1;
        });
    }
}

class BuildingSummaryInformationGetter {

    constructor (private applicationService: ApplicationService) { }

    getRemovedStructures() {
        let previousSections = this.applicationService.previousVersion.Sections;
        return this.applicationService.currentVersion.Sections.filter((section, index) => 
            this.isSectionRemoved(section) 
            && !this.isSectionRemoved(previousSections.at(index)) 
            && !!section.Addresses && section.Addresses.length > 0
        );
    }    

    private isSectionRemoved(section?: SectionModel) {
        return section != undefined && section.Status == Status.Removed;
    }

    getCurrentSectionNames(): string[] {
        return BuildingSummaryInformationGetter.getNamesOf(this.applicationService.currentVersion.Sections, this.applicationService.model.BuildingName!);
    }

    getPreviousSectionNames(): string[] {
        return BuildingSummaryInformationGetter.getNamesOf(this.applicationService.previousVersion.Sections, this.applicationService.model.BuildingName!);
    }

    static getNamesOf(sections: SectionModel[], buildingName: string) {
        let names = sections.filter(x => x.Status != Status.Removed).map(x => x.Name!);
        if(!names || names.length == 0 || names.every(x => x == null || x == undefined)) return [buildingName];
        return names;
    }
}

class BuildingSummaryComparator {
    static areBuildingsEqual(sectionsA: SectionModel[], sectionsB: SectionModel[]) {
        if (!this.sectionsHaveSameLength(sectionsA, sectionsB)) return false;
        return sectionsA.every((x, index) => this.areSectionsEqual(x, sectionsB[index]));
    }

    static sectionsHaveSameLength(sectionsA: SectionModel[], sectionsB: SectionModel[]) {
        let sectionANames = BuildingSummaryInformationGetter.getNamesOf(sectionsA, "");
        let sectionBNames = BuildingSummaryInformationGetter.getNamesOf(sectionsB, "");
        return sectionANames.length == sectionBNames.length;
    }

    static areSectionsEqual(sectionA: SectionModel, sectionB: SectionModel) {
        return this.areNamesEqual(sectionA.Name ?? "", sectionB.Name ?? "") 
            && this.arePostcodesEqual(sectionA.Addresses[0]?.Postcode ?? "", sectionB.Addresses[0]?.Postcode ?? "")
            && this.areStructureStatusEqual(sectionA.Status, sectionB.Status);
    }

    static areStructureStatusEqual(statusA: Status, statusB: Status) {
        return statusA == statusB;
    }

    static areNamesEqual(nameA: string, nameB: string) {
        return nameA == nameB;
    }
    
    static arePostcodesEqual(postcodeA: string, postcodeB: string) {
        let a = postcodeA.toLowerCase().replaceAll(' ', '');
        let b = postcodeB.toLowerCase().replaceAll(' ', '');
        return a === b;
    }
}