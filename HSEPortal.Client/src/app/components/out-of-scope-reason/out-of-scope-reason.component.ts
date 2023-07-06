import { Component, Input, OnInit } from '@angular/core';
import { OutOfScopeReason, SectionModel } from 'src/app/services/application.service';

@Component({
  selector: 'out-of-scope-reason',
  templateUrl: './out-of-scope-reason.component.html'
})
export class OutOfScopeReasonComponent implements OnInit {
  @Input() public OutOfScopeReason?: OutOfScopeReason;
  @Input() public SectionModel?: SectionModel;
  @Input() public SectionBuildingName?: string;

  public floorsAbove!: number;
  public height!: number;
  public residentialUnits!: number;

  constructor() { }

  ngOnInit(): void {
    this.floorsAbove = this.SectionModel!.FloorsAbove!;
    this.height = this.SectionModel!.Height!;
    this.residentialUnits = this.SectionModel!.ResidentialUnits!;
  }

  showHeightReason() {
    return this.OutOfScopeReason == OutOfScopeReason.Height;
  }

  showNumberResidentialUnitsReason() {
    return this.OutOfScopeReason == OutOfScopeReason.NumberResidentialUnits;
  }

  showPeopleLivingInBuildingReason() {
    return this.OutOfScopeReason == OutOfScopeReason.PeopleLivingInBuilding;
  }

}
