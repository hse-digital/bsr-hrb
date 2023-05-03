import { ApplicationService, SectionAccountability, SectionModel } from "../services/application.service";

export class AccountabilityAreasHelper {

    static isApAccountableFor(applicationService: ApplicationService, apIndex: number, section: SectionModel, area: string): boolean {
        return applicationService.model.AccountablePersons[apIndex]?.SectionsAccountability
            ?.find(x => x.SectionName == section.Name ?? applicationService.model.BuildingName)
            ?.Accountability?.includes(area) ?? false;
    }

    static getAp(applicationService: ApplicationService, section: SectionModel, area: string) {
        let aps = []
        for (let i = 0; i < applicationService.model.AccountablePersons.length; i++) {
            let sectionAccountability = applicationService.model.AccountablePersons[i].SectionsAccountability?.find(x => x.SectionName == section.Name ?? applicationService.model.BuildingName);
            if (sectionAccountability?.Accountability?.includes(area)) aps.push(i)
        }
        return aps;
    }

}