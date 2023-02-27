export class SectionNameHelper {
    static getSectionCardinalName(sectionIndex: number): string {
        switch (sectionIndex) {
            case 0: return 'First';
            case 1: return 'Second';
            case 2: return 'Third';
            case 3: return 'Fourth';
            case 4: return 'Fifth';
        }

        return "Last";
    }
}