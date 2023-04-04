import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SummaryComponent } from "src/app/helpers/summary-helper";
import { AccountablePersonModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'individual-answers',
  templateUrl: './individual-answers.component.html'
})
export class IndividualAnswersComponent extends SummaryComponent {

  @Input() override ap!: AccountablePersonModel;
  @Input() override apIndex!: number;
  @Input() override hasMoreAp = false;

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
    super();
  }

  addMore() {
    this.navigationService.navigateRelative('add-more', this.activatedRoute);
  }

  goToApType() {
    if (this.apIndex == 0) {
      this.navigationService.navigateRelative('', this.activatedRoute);
    } else {
      this.navigateTo('accountable-person-type');
    }
  }

  navigateTo(url: string, query?: string) {
    this.navigationService.navigateRelative(`accountable-person-${this.apIndex + 1}/${url}`, this.activatedRoute, {
      return: 'check-answers'
    });
  }

  getYourAddress() {
    return this.apIndex == 0 && this.ap.IsPrincipal == 'yes' ?
      this.ap.PapAddress : this.ap.Address;
  }

  getPapAddress() {
    return this.apIndex == 0 && this.ap.IsPrincipal == 'no' ?
      this.ap.PapAddress : this.ap.Address;
  }
}
