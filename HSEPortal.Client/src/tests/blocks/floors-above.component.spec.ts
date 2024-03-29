import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { BuildingFloorsAboveComponent } from 'src/app/features/application/blocks/floors-above/floors-above.component';

let component: BuildingFloorsAboveComponent;
let fixture: ComponentFixture<BuildingFloorsAboveComponent>;

describe('BuildingFloorsAboveComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingFloorsAboveComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler, CaptionService]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingFloorsAboveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, floorsAbove: any[] }[] = [
    { description: 'should show an error when the floorsAbove is empty.', floorsAbove: [undefined] },
    { description: 'should show an error when the floorsAbove has letters.', floorsAbove: ['abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'] },
    { description: 'should show an error when the floorsAbove has decimals.', floorsAbove: [1.2, 100.5, 0.9999, 1.9999, 999.99999, 500.55, 200.00001] },
    { description: 'should show an error when the floorsAbove is equal or less than cero.', floorsAbove: [0, -1, -100] },
    { description: 'should show an error when the floorsAbove is equal or greater than 1000.', floorsAbove: [1000, 1001, 5000] },
  ]

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.floorsAbove?.forEach((floors) => {
        applicationService.newApplication();
        applicationService.currentBlock.FloorsAbove = floors;
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));
  });

  it('should NOT show an error when the floorsAbove greater than 0 and less than 1000.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let floorsAbove: number[] = [1, 3, 100, 150, 500, 999]
    spyOn(router, 'navigate');
    floorsAbove.forEach(floors => {
      applicationService.newApplication();
      applicationService.currentBlock.FloorsAbove = floors;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});

describe('BuildingFloorsAboveComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingFloorsAboveComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler, CaptionService]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingFloorsAboveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the floorsAbove is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let wrongFloors: any = [0, -1, -100, 1.2, 100.5, 1000, 1001, 5000, 0.9999, 1.9999, 999.99999, 500.55, 200.00001, undefined, 'abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'];

    spyOn(router, 'navigate');
    wrongFloors.forEach((floorsAbove: any) => {
      applicationService.newApplication();
      applicationService.currentBlock.FloorsAbove = floorsAbove;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display an error message when the floorsAbove is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let floorsAbove: number[] = [1, 3, 100, 150, 500, 999]

    spyOn(router, 'navigate');
    floorsAbove.forEach(floorsAbove => {
      applicationService.newApplication();
      applicationService.currentBlock.FloorsAbove = floorsAbove;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });

  })));

});
