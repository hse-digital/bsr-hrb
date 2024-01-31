import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

@Component({
  selector: 'hse-yes-but-no-reference',
  templateUrl: './yes-but-no-reference.html'
})
export class YesButNoReferenceComponent extends PageComponent<string> {
  static route: string = 'yes-but-no-reference';
  static title: string = "Find your application reference – Register a high-rise building – GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return false;
  }

  override async navigateNext(): Promise<boolean | void> {   
    return this.navigationService.navigate('');
  }
}
