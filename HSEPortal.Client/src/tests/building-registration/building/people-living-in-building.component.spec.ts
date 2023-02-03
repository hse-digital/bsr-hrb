import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { CaptionService } from '../../../app/building-registration/building/caption.service';
import { PeopleLivingInBuildingComponent } from '../../../app/building-registration/building/people-living-in-building/people-living-in-building.component';
import { BlockRegistrationService } from '../../../app/services/building-registration/block-registration.service';
import { BuildingRegistrationService } from '../../../app/services/building-registration/building-registration.service';

let component: PeopleLivingInBuildingComponent;
let fixture: ComponentFixture<PeopleLivingInBuildingComponent>;

describe('PeopleLivingInBuildingComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler, CaptionService, BlockRegistrationService]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the peopleLivingInBuilding is empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.peopleLivingInBuilding = undefined;
    component.saveAndContinue();
    expect(component.hasErrors).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT show an error when the value of peopleLivingInBuilding is "yes", "no_block_ready" or "no_wont_move"', async(inject([Router], (router: any) => {
    let peopleLivingInBuilding: string[] = ["yes", "no_block_ready", "no_wont_move"]
    spyOn(router, 'navigate');
    peopleLivingInBuilding.forEach(peopleLivingInBuilding => {
      component.building.peopleLivingInBuilding = peopleLivingInBuilding;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});

describe('PeopleLivingInBuildingComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler, CaptionService, BlockRegistrationService]
    }).compileComponents();
    fixture = TestBed.createComponent(PeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the peopleLivingInBuilding is not valid.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.peopleLivingInBuilding = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the peopleLivingInBuilding is valid.', async(inject([Router], (router: any) => {
    let peopleLivingInBuilding: string[] = ["yes", "no_block_ready", "no_wont_move"]
    spyOn(router, 'navigate');
    peopleLivingInBuilding.forEach(peopleLivingInBuilding => {
      component.building.peopleLivingInBuilding = peopleLivingInBuilding;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});
