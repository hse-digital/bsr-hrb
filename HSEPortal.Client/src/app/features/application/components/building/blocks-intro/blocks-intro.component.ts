import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Application } from "express";
import { ApplicationService } from "../../../../../services/application.service";

@Component({
    templateUrl: './blocks-intro.component.html'
})
export class BuildingBlocksIntroComponent {

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public applicationService: ApplicationService) {
    let blockId = this.activatedRoute.snapshot.params['blockId'];
    this.applicationService.model.Blocks?.push({ Id: blockId });
  }

  onClick() {
    this.router.navigate(['../block-name'], { relativeTo: this.activatedRoute })
  }

}
