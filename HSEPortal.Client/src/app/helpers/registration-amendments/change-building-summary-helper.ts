import { AddressModel } from "src/app/services/address.service";
import { SectionModel, ChangeSection, ApplicationService } from "src/app/services/application.service";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeBuildingSummaryHelper {

    constructor(private applicationService: ApplicationService) {

    }

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

    getSectionAddresses(SectionAddresses: AddressModel[], ChangeSectionAddresses: AddressModel[]): AddressModel[] {
        return ChangeSectionAddresses.map((change, index) => {
            let hasChanged = this.hasChanged(SectionAddresses[index], change);
            return hasChanged ? change : SectionAddresses[index];
        });
    }

    getLatestValueOf(field?: any, changedField?: any) {
        let hasChanged = this.hasChanged(field, changedField);
        return hasChanged ? changedField : field;
    }

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
            return this.hasChanged(element, ChangeSectionAddresses[index]);
        });
    }

}