import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SectionPeopleLivingInBuildingComponent } from 'src/app/features/application/sections/people-living-in-building/people-living-in-building.component';

import { ApplicationService } from 'src/app/services/application.service';

let component: SectionPeopleLivingInBuildingComponent;
let fixture: ComponentFixture<SectionPeopleLivingInBuildingComponent>;


describe('PeopleLivingInBuildingComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionPeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionPeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the peopleLivingInBuilding is empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.currentSection.PeopleLivingInBuilding = undefined;
    component.saveAndContinue();
    expect(component.hasErrors).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT show an error when the value of peopleLivingInBuilding is "yes", "no_block_ready" or "no_wont_move"',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let peopleLivingInBuilding: string[] = ["yes", "no_block_ready", "no_wont_move"]
    spyOn(router, 'navigate');
    peopleLivingInBuilding.forEach(peopleLivingInBuilding => {
      applicationService.currentSection.PeopleLivingInBuilding = peopleLivingInBuilding;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});

describe('PeopleLivingInBuildingComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionPeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(SectionPeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the peopleLivingInBuilding is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.currentSection.PeopleLivingInBuilding = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the peopleLivingInBuilding is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let peopleLivingInBuilding: string[] = ["yes", "no_block_ready", "no_wont_move"]
    spyOn(router, 'navigate');
    peopleLivingInBuilding.forEach(peopleLivingInBuilding => {
      applicationService.currentSection.PeopleLivingInBuilding = peopleLivingInBuilding;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});
