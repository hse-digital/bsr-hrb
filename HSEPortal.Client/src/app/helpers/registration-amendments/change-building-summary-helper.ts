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

    constructor(private applicationService: ApplicationService) { }

    getSectionNames(): string[] {
        return this.applicationService.currentVersion.Sections.filter(section => section.Status != Status.Removed).map(x => x.Name!);
    }

    getRemovedStructures() {
        let previousSections = this.applicationService.model.Versions.find(x => !FieldValidations.IsNotNullOrWhitespace(x.ReplacedBy))!.Sections;
        return this.applicationService.currentVersion.Sections.filter((section, index) => section.Status == Status.Removed && previousSections[index].Status != Status.Removed &&  !!section.Addresses && section.Addresses.length > 0);
    }

    getChanges(): BuildingSummaryChangeModel[] {
        let originalVersion = this.applicationService.model.Versions.find(x => !FieldValidations.IsNotNullOrWhitespace(x.ReplacedBy));
        return this.applicationService.currentVersion.Sections.flatMap((section, index) => {
            if (section.Status == Status.Removed) return undefined;
            let originalSection = originalVersion!.Sections.length <= index ? new SectionModel() : originalVersion!.Sections[index];
            return this.getSectionChanges(originalSection, section, index);
        }).filter(x => !!x).map(x => x!);
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