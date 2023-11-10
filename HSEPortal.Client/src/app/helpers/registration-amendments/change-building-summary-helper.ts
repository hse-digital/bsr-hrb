import { AddressModel } from "src/app/services/address.service";
import { SectionModel, ChangeSection, ApplicationService, Status } from "src/app/services/application.service";
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

    constructor(private applicationService: ApplicationService) {

    }

    // Get sections

    getSections(): SectionModel[] {
        return this.applicationService.model.Sections.map((section, index) => {
            let changedSections = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections ?? new Array<ChangeSection>(this.applicationService.model.Sections.length);
            return this.getSection(section, changedSections[index]?.SectionModel ?? new SectionModel());
        });
    }

    getSection(section: SectionModel, changedSection: SectionModel): SectionModel {
        let sectionModel: SectionModel = new SectionModel();
        sectionModel.Name = this.getLatestValueOf(section.Name, changedSection.Name);
        sectionModel.FloorsAbove = this.getLatestValueOf(section.FloorsAbove, changedSection.FloorsAbove);
        sectionModel.Height = this.getLatestValueOf(section.Height, changedSection.Height);
        sectionModel.ResidentialUnits = this.getLatestValueOf(section.ResidentialUnits, changedSection.ResidentialUnits);
        sectionModel.WhoIssuedCertificate = this.getLatestValueOf(section.WhoIssuedCertificate, changedSection.WhoIssuedCertificate);
        sectionModel.YearOfCompletion = this.getLatestValueOf(section.YearOfCompletion, changedSection.YearOfCompletion);
        sectionModel.YearOfCompletionOption = this.getLatestValueOf(section.YearOfCompletionOption, changedSection.YearOfCompletionOption);
        sectionModel.YearOfCompletionRange = this.getLatestValueOf(section.YearOfCompletionRange, changedSection.YearOfCompletionRange);
        sectionModel.CompletionCertificateIssuer = this.getLatestValueOf(section.CompletionCertificateIssuer, changedSection.CompletionCertificateIssuer);
        sectionModel.CompletionCertificateReference = this.getLatestValueOf(section.CompletionCertificateReference, changedSection.CompletionCertificateReference);
        sectionModel.CompletionCertificateFile = this.getLatestValueOf(section.CompletionCertificateFile, changedSection.CompletionCertificateFile);
        sectionModel.CompletionCertificateDate = this.getLatestValueOf(section.CompletionCertificateDate, changedSection.CompletionCertificateDate);
        sectionModel.Addresses = this.getSectionAddresses(section.Addresses, changedSection.Addresses);
        return sectionModel;
    }

    getLatestValueOf(field?: any, changedField?: any) {
        let hasChanged = this.hasChanged(field, changedField);
        return hasChanged ? changedField : field;
    }

    getSectionAddresses(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[]): AddressModel[] {
        if (!ChangeSectionAddresses || ChangeSectionAddresses.length == 0) return SectionAddresses;
        return ChangeSectionAddresses.map((element, index) => {
            let hasChanged = this.hasChanged((SectionAddresses.at(index) ?? new AddressModel), element);
            return hasChanged ? element: (SectionAddresses.at(index) ?? new AddressModel);
        });
    }

    // Has building changed?

    hasBuildingChange() {
        return this.applicationService.model.Sections.some((section, index) => {
            let changedSections = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections ?? new Array<ChangeSection>(this.applicationService.model.Sections.length);
            return this.hasSectionChange(section, changedSections[index]?.SectionModel ?? new SectionModel());
        });
    }

    hasSectionChange(section: SectionModel, changedSection: SectionModel): boolean {
        let hasChanged = false;
        hasChanged ||= this.hasChanged(section.Name, changedSection.Name);
        hasChanged ||= this.hasChanged(section.FloorsAbove, changedSection.FloorsAbove);
        hasChanged ||= this.hasChanged(section.Height, changedSection.Height);
        hasChanged ||= this.hasChanged(section.ResidentialUnits, changedSection.ResidentialUnits);
        hasChanged ||= this.hasChanged(section.WhoIssuedCertificate, changedSection.WhoIssuedCertificate);
        hasChanged ||= this.hasChanged(section.YearOfCompletion, changedSection.YearOfCompletion);
        hasChanged ||= this.hasChanged(section.YearOfCompletionOption, changedSection.YearOfCompletionOption);
        hasChanged ||= this.hasChanged(section.YearOfCompletionRange, changedSection.YearOfCompletionRange);
        hasChanged ||= this.hasChanged(section.CompletionCertificateIssuer, changedSection.CompletionCertificateIssuer);
        hasChanged ||= this.hasChanged(section.CompletionCertificateReference, changedSection.CompletionCertificateReference);
        hasChanged ||= this.hasChanged(section.CompletionCertificateFile, changedSection.CompletionCertificateFile);
        hasChanged ||= this.hasChanged(section.CompletionCertificateDate, changedSection.CompletionCertificateDate);
        hasChanged ||= this.hasAddressChanged(section.Addresses, changedSection.Addresses);
        return hasChanged;
    }

    hasChanged(field?: any, changedField?: any) {
        let hasNewValue = typeof changedField == "string" ? FieldValidations.IsNotNullOrWhitespace(changedField) : changedField != undefined;
        return hasNewValue && field != changedField;
    }

    hasAddressChanged(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[]) {
        return SectionAddresses.some((element, index) => {
            return this.hasChanged(element.Postcode, ChangeSectionAddresses[index].Postcode);
        });
    }

    // Count number of changes

    getBuildingCount(): number {
        let counter = 0;
        this.applicationService.model.Sections.forEach((section, index) => {
            let changedSections = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections ?? new Array<ChangeSection>(this.applicationService.model.Sections.length);
            counter += this.getSectionCount(section, changedSections[index]?.SectionModel ?? new SectionModel());
        });
        return counter;
    }

    getSectionCount(section: SectionModel, changedSection: SectionModel): number {
        let counter = 0;
        counter += this.getFieldCount(section.Name, changedSection.Name);
        counter += this.getFieldCount(section.FloorsAbove, changedSection.FloorsAbove);
        counter += this.getFieldCount(section.Height, changedSection.Height);
        counter += this.getFieldCount(section.ResidentialUnits, changedSection.ResidentialUnits);
        counter += this.getFieldCount(section.WhoIssuedCertificate, changedSection.WhoIssuedCertificate);
        counter += this.getFieldCount(section.YearOfCompletion, changedSection.YearOfCompletion);
        counter += this.getFieldCount(section.YearOfCompletionOption, changedSection.YearOfCompletionOption);
        counter += this.getFieldCount(section.YearOfCompletionRange, changedSection.YearOfCompletionRange);
        counter += this.getFieldCount(section.CompletionCertificateIssuer, changedSection.CompletionCertificateIssuer);
        counter += this.getFieldCount(section.CompletionCertificateReference, changedSection.CompletionCertificateReference);
        counter += this.getFieldCount(section.CompletionCertificateFile, changedSection.CompletionCertificateFile);
        counter += this.getFieldCount(section.CompletionCertificateDate, changedSection.CompletionCertificateDate);
        counter += this.getAddressCount(section.Addresses, changedSection.Addresses);
        return counter;
    }

    getFieldCount(field?: any, changedField?: any) {
        let oldValueExists = typeof field == "string" ? FieldValidations.IsNotNullOrWhitespace(field) : field != undefined;
        
        return oldValueExists && this.hasChanged(field, changedField) ? 1 : 0;
    }

    getAddressCount(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[]): number {
        let counter = 0;
        SectionAddresses.forEach((element, index) => {
            counter += this.getFieldCount(element, ChangeSectionAddresses[index]);
        });
        return counter;
    }

    // Get only the changes

    getOnlyChanges(): BuildingSummaryChangeModel[] {
        return this.applicationService.model.Sections.flatMap((section, index) => {
            let changedSections = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections ?? new Array<ChangeSection>(this.applicationService.model.Sections.length);
            let change = changedSections[index]?.Status == Status.Removed ? new SectionModel() : changedSections[index]?.SectionModel;
            return this.getSectionChanges(section, change ?? new SectionModel(), index);
        });
    }

    getSectionChanges(section: SectionModel, changedSection: SectionModel, sectionIndex: number): BuildingSummaryChangeModel[] {
        if (!section || !section.Addresses || section.Addresses.length == 0) return [];
        let sectionName = this.getLatestValueOf(section.Name, changedSection.Name) ?? this.applicationService.model.BuildingName!;
        let changes: (BuildingSummaryChangeModel | undefined)[] = [];
        changes.push(this.getFieldChange(section.Name, changedSection.Name, "Name", "Name", "name", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.FloorsAbove, changedSection.FloorsAbove, "Number of floors", sectionName + " number of floors", "floors", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.Height, changedSection.Height, "Height", sectionName +  " height", "height", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.ResidentialUnits, changedSection.ResidentialUnits, "Residential units", sectionName + " number of residential units", "residential-units", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.WhoIssuedCertificate, changedSection.WhoIssuedCertificate, "Who issued certificate", sectionName + " who issued certificate", "certificate-issuer", sectionName, sectionIndex));
        
        changes.push(this.getYearOfCompletion(section, changedSection, sectionName, sectionIndex))
        
        changes.push(this.getFieldChange(section.CompletionCertificateIssuer, changedSection.CompletionCertificateIssuer, "Completion certificate issuer", sectionName +  " completion certificate issuer", "certificate-issuer", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.CompletionCertificateReference, changedSection.CompletionCertificateReference, "Completion certificate reference", sectionName +  " completion certificate reference", "certificate-number", sectionName, sectionIndex));
        changes.push(this.getFieldChange(section.CompletionCertificateFile, changedSection.CompletionCertificateFile, "Completion certificate file", sectionName +  " completion certificate file", "upload-completion-certificate", sectionName, sectionIndex));
        changes.push(this.getSectionAddressChanges(section.Addresses, changedSection.Addresses, "Addresses", sectionName + " addresses", "building-change-check-answers", sectionName, sectionIndex));
        return changes.filter(x => !!x && x != undefined).map(x => x!);
    }

    getYearOfCompletion(section: SectionModel, changedSection: SectionModel, sectionName: string, sectionIndex: number) {
        let yearOfCompletionOption = this.getLatestValueOf(section.YearOfCompletionOption, changedSection.YearOfCompletionOption)
        if (yearOfCompletionOption == "year-exact") {
            return this.getFieldChange(section.YearOfCompletion, changedSection.YearOfCompletion, "Year of completion", "When was " + sectionName + " built?", "year-of-completion", sectionName, sectionIndex);
        } else if (yearOfCompletionOption == "year-not-exact") {
            return this.getFieldChange(section.YearOfCompletionRange, changedSection.YearOfCompletionRange, "Year of completion range",  "When was " + sectionName + " built?", "year-range", sectionName, sectionIndex);
        }
        return undefined;
    }

    getFieldChange(field: any, changedfield: any, fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): BuildingSummaryChangeModel | undefined {
        return this.hasChanged(field, changedfield) ?  {
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

    getSectionAddressChanges(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[], fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): BuildingSummaryChangeModel | undefined {
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

    // Names

    getSectionNames(): string[] {
        return this.getSections().filter((x, index) => this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[index].Status != Status.Removed).map(x => x.Name!);
    }

    // Removed structures that already exists

    getRemovedStructures() {
        return this.applicationService.model.Sections.filter((x, index) => this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[index].Status == Status.Removed && !!x.Addresses && x.Addresses.length > 0);
    }

}