import { Directive, Input } from "@angular/core";

@Directive({
  selector: '[govukRequired]'
})
export class GovukRequiredDirective {
  @Input() govukRequired: any;
}