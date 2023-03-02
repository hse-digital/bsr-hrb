import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'yearOfCompletionOptionDescription'
})
export class YearOfCompletionOptionPipe implements PipeTransform {

    transform(value: any, ...args: any[]) {
        switch (value) {
            case "year-not-exact": return "I don't know the exact year";
            case "not-completed": return "The block has not yet been completed";
        }

        return value;
    }

}