import { SectionModel, ApplicationService, Status } from "src/app/services/application.service";
import { ChangeHelper, ChangedAnswersModel } from "./change-helper";

export class ChangeBuildingSummaryHelper {

    private _buildingSummaryChanges: BuildingSummaryChanges;
    private _buildingSummaryInformationGetter: BuildingSummaryInformationGetter;

    constructor(private applicationService: ApplicationService) { 
        this._buildingSummaryChanges = new BuildingSummaryChanges(this.applicationService);
        this._buildingSummaryInformationGetter = new BuildingSummaryInformationGetter(this.applicationService);
    }

    getChanges(): ChangedAnswersModel[] {
        return this._buildingSummaryChanges.getChanges(
            this._buildingSummaryInformationGetter.getPreviousSectionNames(),
            this._buildingSummaryInformationGetter.getCurrentSectionNames()
        );
    }

    getRemovedStructures() {
        return this._buildingSummaryInformationGetter.getRemovedStructures();
    }
}

class BuildingSummaryChanges extends ChangeHelper {

    constructor (private applicationService: ApplicationService) {
        super();
    }

    getChanges(previousSectionNames: string[], currentSectionNames: string[]): ChangedAnswersModel[] {
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

    getSectionChanges(originalSection: SectionModel, currentSection: SectionModel, sectionIndex: number): ChangedAnswersModel[] {
        if (!originalSection || !originalSection.Addresses || originalSection.Addresses.length == 0) return [];
        let sectionName = this.getLatestValueOf(originalSection.Name, currentSection.Name) ?? this.applicationService.model.BuildingName!;
        let changes: (ChangedAnswersModel | undefined)[] = [];
        changes.push(this.getFieldChange(originalSection.Name, currentSection.Name, "Name", "Name", "name", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.FloorsAbove, currentSection.FloorsAbove, "Number of floors", sectionName + " number of floors", "floors", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.Height, currentSection.Height, "Height", sectionName + " height", "height", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.ResidentialUnits, currentSection.ResidentialUnits, "Residential units", sectionName + " number of residential units", "residential-units", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.WhoIssuedCertificate, currentSection.WhoIssuedCertificate, "Who issued certificate", sectionName + " who issued certificate", "certificate-issuer", sectionName, sectionIndex));

        changes.push(this.getYearOfCompletion(originalSection, currentSection, sectionName, sectionIndex))

        changes.push(this.getFieldChange(originalSection.CompletionCertificateIssuer, currentSection.CompletionCertificateIssuer, "Completion certificate issuer", sectionName + " completion certificate issuer", "certificate-issuer", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.CompletionCertificateReference, currentSection.CompletionCertificateReference, "Completion certificate reference", sectionName + " completion certificate reference", "certificate-number", sectionName, sectionIndex));
        changes.push(this.getFieldChange(originalSection.CompletionCertificateFile?.Filename, currentSection.CompletionCertificateFile?.Filename, "Completion certificate file", sectionName + " completion certificate file", "upload-completion-certificate", sectionName, sectionIndex));
        changes.push(this.getAddressChanges(originalSection.Addresses, currentSection.Addresses, "Addresses", sectionName + " addresses", "building-change-check-answers", sectionName, sectionIndex));
        return changes.filter(x => !!x && x != undefined).map(x => x!);
    }

    private getYearOfCompletion(originalSection: SectionModel, currentSection: SectionModel, sectionName: string, sectionIndex: number) {
        let currentYear = currentSection.YearOfCompletionOption == "year-exact" ? currentSection.YearOfCompletion : currentSection.YearOfCompletionRange;
        let originalYear = originalSection.YearOfCompletionOption == "year-exact" ? originalSection.YearOfCompletion : originalSection.YearOfCompletionRange;
        return this.getFieldChange(originalYear, currentYear, "Year of completion", "When was " + sectionName + " built?", "year-of-completion", sectionName, sectionIndex);
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