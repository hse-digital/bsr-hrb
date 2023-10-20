import { AddressModel } from "src/app/services/address.service";
import { SectionModel, ChangeSection, ApplicationService } from "src/app/services/application.service";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeBuildingSummaryHelper {
    
    private applicationService: ApplicationService;

    constructor(applicationService: ApplicationService) {
        this.applicationService = applicationService;
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
        return SectionAddresses.map((element, index) => {
        return this.getLatestValueOf(element, ChangeSectionAddresses[index]);
        }); 
    }

    getLatestValueOf(field?: any, changedField?: any) {
        let hasChanged = typeof changedField == "string" ? FieldValidations.IsNotNullOrWhitespace(changedField) : changedField != undefined;
        return hasChanged ? changedField : field;
    }
}