import { ApplicationService, SectionAccountability, SectionModel } from "../services/application.service";

export class AccountabilityAreasHelper {

    static updateAccountabilityAreas(applicationService: ApplicationService, accountablePersonIndex: number, section: SectionModel, area: string) {
        let accountability = AccountabilityAreasHelper.getAccountabilityFor(applicationService, accountablePersonIndex, section);

        if (accountablePersonIndex == 0 && area !== 'none' && accountability.includes('none')) {
            let noneIndex = accountability.indexOf('none');
            if (noneIndex > -1) accountability.splice(noneIndex, 1);
        }

        if (!AccountabilityAreasHelper.isApAccountableFor(applicationService, accountablePersonIndex, section, area)) {
            accountability.push(area);
        } else {
            let areaIndex = accountability.indexOf(area);
            if (areaIndex) accountability.splice(areaIndex, 1);
        }

        return accountability;
    }

    static isApAccountableFor(applicationService: ApplicationService, apIndex: number, section: SectionModel, area: string): boolean {
        return applicationService.model.AccountablePersons[apIndex]?.SectionsAccountability
            ?.find(x => x.SectionName == (section.Name ?? applicationService.model.BuildingName))
            ?.Accountability?.includes(area) ?? false;
    }

    static getAccountabilityFor(applicationService: ApplicationService, accountablePersonIndex: number, section: SectionModel) {
        return applicationService.model.AccountablePersons[accountablePersonIndex].SectionsAccountability
            ?.find(x => x.SectionName == (section.Name ?? applicationService.model.BuildingName))?.Accountability ?? [];
    }

    private static areasOfAccountability: string[] = ["routes", "maintenance", "facilities"];
    static getNotAllocatedAreasOf(applicationService: ApplicationService, section: SectionModel) {
        let accountabilityAreasOfSection = applicationService.model.AccountablePersons
            .flatMap(x => x.SectionsAccountability)
            .filter(x => x?.SectionName == (section.Name ?? applicationService.model.BuildingName!))
            .flatMap(x => x?.Accountability);

        return this.areasOfAccountability.filter(x => !accountabilityAreasOfSection.includes(x));
    }

}