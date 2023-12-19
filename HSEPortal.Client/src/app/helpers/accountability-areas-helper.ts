import { AccountablePersonModel, ApplicationService, SectionAccountability, SectionModel } from "../services/application.service";

export class AccountabilityAreasHelper {

    static updateAccountabilityAreas(AccountablePersons: AccountablePersonModel[], BuildingName: string, accountablePersonIndex: number, section: SectionModel, area: string) {
        let accountability = AccountabilityAreasHelper.getAccountabilityFor(AccountablePersons, BuildingName, accountablePersonIndex, section);

        if (accountablePersonIndex == 0 && area !== 'none' && accountability.includes('none')) {
            let noneIndex = accountability.indexOf('none');
            if (noneIndex > -1) accountability.splice(noneIndex, 1);
        }

        if (!AccountabilityAreasHelper.isApAccountableFor(AccountablePersons, BuildingName, accountablePersonIndex, section, area)) {
            accountability.push(area);
        } else {
            let areaIndex = accountability.indexOf(area);
            if (areaIndex) accountability.splice(areaIndex, 1);
        }

        return accountability;
    }

    static isApAccountableFor(AccountablePersons: AccountablePersonModel[], BuildingName: string, apIndex: number, section: SectionModel, area: string): boolean {
        return AccountablePersons[apIndex]?.SectionsAccountability
            ?.find(x => x.SectionName == (section.Name ?? BuildingName))
            ?.Accountability?.includes(area) ?? false;
    }

    static getAccountabilityFor(AccountablePersons: AccountablePersonModel[], BuildingName: string, accountablePersonIndex: number, section: SectionModel) {
        return AccountablePersons[accountablePersonIndex].SectionsAccountability
            ?.find(x => x.SectionName == (section.Name ?? BuildingName))?.Accountability ?? [];
    }

    private static areasOfAccountability: string[] = ["routes", "maintenance", "facilities"];
    static getNotAllocatedAreasOf(AccountablePersons: AccountablePersonModel[], BuildingName: string, section: SectionModel) {
        let accountabilityAreasOfSection = AccountablePersons
        .flatMap(person => person.SectionsAccountability)
        .filter(accountability => {
            const sectionName = section.Name ?? BuildingName!;
            const buildingSectionName = BuildingName ?? section.Name;
            return (accountability?.SectionName === sectionName || accountability?.SectionName === buildingSectionName);
        })
        .flatMap(accountability => accountability?.Accountability);
    

        return this.areasOfAccountability.filter(x => !accountabilityAreasOfSection.includes(x));
    }

}