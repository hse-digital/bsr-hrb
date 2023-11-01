import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'peopleLivingInSectionDescription'
})
export class PeopleLivingInSectionDescriptionPipe implements PipeTransform {

    transform(value: any, ...args: any[]) {
        switch (value) {
            case "yes": return "Yes";
            case "no_section_ready": return "No, but the block is ready for people to move in";
            case "no_wont_move": return "No and people will not be moving in";
        }

        return "Not answered";
    }

}