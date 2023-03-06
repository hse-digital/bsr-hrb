import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountablePersonCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';

  aps: AccountablePersonModel[] = [];
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('../add-more', activatedRoute);
  }
}
