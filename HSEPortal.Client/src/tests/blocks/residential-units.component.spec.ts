import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SectionResidentialUnitsComponent } from 'src/app/features/application/sections/residential-units/residential-units.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: SectionResidentialUnitsComponent;
let fixture: ComponentFixture<SectionResidentialUnitsComponent>;


describe('ResidentialUnitsComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionResidentialUnitsComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionResidentialUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, residentialUnits: any[] }[] = [
    { description: 'should show an error when the residentialUnits is empty.', residentialUnits: [undefined] },
    { description: 'should show an error when the residentialUnits has letters.', residentialUnits: ['abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'] },
    { description: 'should show an error when the residentialUnits has decimals.', residentialUnits: [1.2, 100.5, 0.9999, 1.9999, 999.99999, 500.55, 200.00001] },
    { description: 'should show an error when the residentialUnits is equal or less than cero.', residentialUnits: [0, -1, -100] },
    { description: 'should show an error when the residentialUnits is equal or greater than 10000.', residentialUnits: [10000, 10001, 50000] },
  ]

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.residentialUnits?.forEach((residentialUnits) => {
        applicationService.newApplication();
        applicationService.currentSection.ResidentialUnits = residentialUnits;
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));
  });

  it('should NOT show an error when the residentialUnits greater than 0 and less than 1000.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let residentialUnits: number[] = [1, 3, 100, 150, 500, 999, 1000, 2500, 9999]
    spyOn(router, 'navigate');
    residentialUnits.forEach(residentialUnits => {
      applicationService.newApplication();
      applicationService.currentSection.ResidentialUnits = residentialUnits;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});

describe('ResidentialUnitsComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionResidentialUnitsComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionResidentialUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the residentialUnits is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let wrongResidentialUnits: any = [0, -1, -100, 1.2, 100.5, 0.9999, 1.9999, 999.99999, 500.55, 200.00001, 10000, 9999.9999, 100000, undefined, 'abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'];

    spyOn(router, 'navigate');
    wrongResidentialUnits.forEach((residentialUnits: any) => {
      applicationService.newApplication();
      applicationService.currentSection.ResidentialUnits = residentialUnits;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.residentialUnitsHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.residentialUnitsHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display an error message when the residentialUnits is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let residentialUnits: number[] = [1, 3, 100, 150, 500, 999, 1000, 1500, 2500, 9999]

    spyOn(router, 'navigate');
    residentialUnits.forEach(residentialUnits => {
      applicationService.newApplication();
      applicationService.currentSection.ResidentialUnits = residentialUnits;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.residentialUnitsHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });

  })));

});
