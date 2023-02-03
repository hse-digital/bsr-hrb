import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { CaptionService } from '../../../app/building-registration/building/caption.service';

import { NumberBlocksBuildingComponent } from '../../../app/building-registration/building/number-blocks-building/number-blocks-building.component';
import { BlockRegistrationService } from '../../../app/services/building-registration/block-registration.service';
import { BuildingRegistrationService } from '../../../app/services/building-registration/building-registration.service';

let component: NumberBlocksBuildingComponent;
let fixture: ComponentFixture<NumberBlocksBuildingComponent>;

describe('NumberBlocksBuildingComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberBlocksBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler, CaptionService, BlockRegistrationService]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberBlocksBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the numberBlocksBuilding is empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.numberBlocksBuilding = undefined;
    component.saveAndContinue();
    expect(component.hasErrors).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT show an error when the value of numberBlocksBuilding is "one" or "two-or-more"', async(inject([Router], (router: any) => {
    let numberBlocksBuilding: string[] = ["one", "two-or-more"]
    spyOn(router, 'navigate');
    numberBlocksBuilding.forEach(numberBlocksBuilding => {
      component.building.numberBlocksBuilding = numberBlocksBuilding;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));
});

describe('NumberBlocksBuildingComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberBlocksBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler, CaptionService, BlockRegistrationService]
    }).compileComponents();
    fixture = TestBed.createComponent(NumberBlocksBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the numberBlocksBuilding is not valid.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.numberBlocksBuilding = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the numberBlocksBuilding is valid.', async(inject([Router], (router: any) => {
    let numberBlocksBuilding: string[] = ["one", "two-or-more"]
    spyOn(router, 'navigate');
    numberBlocksBuilding.forEach(numberBlocksBuilding => {
      component.building.numberBlocksBuilding = numberBlocksBuilding;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});
