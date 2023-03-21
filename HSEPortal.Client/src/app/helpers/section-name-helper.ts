import { SectionModel } from "../services/application.service";

export class SectionHelper {
    static getSectionCardinalName(sectionIndex: number): string {
        switch (sectionIndex) {
            case 0: return 'First';
            case 1: return 'Second';
            case 2: return 'Third';
            case 3: return 'Fourth';
            case 4: return 'Fifth';
            case 5: return 'Sixth';
            case 6: return 'Seventh';
            case 7: return 'Eighth';
            case 8: return 'Ninth';
        }

        return "Last";
    }

    static isOutOfScope(section: SectionModel) {
        var fewerThan7Stories = Number(section.FloorsAbove) < 7;
        var lessThan18Meters = Number(section.Height) < 18;

        var criteria1 = fewerThan7Stories && lessThan18Meters;
        var criteria2 = Number(section.ResidentialUnits) < 2;

        return criteria1 || criteria2;
    }
}