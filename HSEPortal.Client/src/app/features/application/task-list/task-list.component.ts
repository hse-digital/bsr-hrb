import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './task-list.component.html'
})
export class ApplicationTaskListComponent extends BaseComponent implements OnInit {

  static route: string = '';
  private applicationId?: string | null;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.model?.id !== undefined && this.applicationService.model?.id == routeSnapshot.params['id'];
  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.applicationId = params.get('id');
    });
  }

  tasks = [
    {
      title: "Prepare your application",
      items: [
        {
          title: "Blocks in the building",
          tag: "NOT STARTED YET",
          link: `/application/${this.applicationService.model.id}/complex-structure`,
          status: 0
        },
        {
          title: "Principal accountable person",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        },
        {
          title: "Other accountable persons",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        },
      ]
    },
    {
      title: "Submit your application",
      items: [
        {
          title: "Apply and pay the fee",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        }
      ]
    }
  ]
}
