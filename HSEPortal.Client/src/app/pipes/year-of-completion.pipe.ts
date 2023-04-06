import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'yearOfCompletionDescription'
})
export class YearOfCompletionPipe implements PipeTransform {

    transform(value: any, ...args: any[]) {
        return value?.toString().replaceAll('-', ' ');
    }

}