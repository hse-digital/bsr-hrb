import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { BuildingNameComponent } from '../../../app/features/new-application/building-name/building-name.component';
import { ApplicationService } from '../../../app/services/application.service';

describe('BuildingNameComponent showError', () => {
  let component: BuildingNameComponent;
  let fixture: ComponentFixture<BuildingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, name?: string }[] = [
    { description: 'should show an error when the name is empty.', name: '' },
    { description: 'should show an error when the name is undefined.', name: undefined },
  ];

  testCasesShowError.forEach((test) => {
    it(test.description, (inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      applicationService.model.BuildingName = test.name;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the name is defined and not empty.', (inject([Router], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.model.BuildingName = 'Building name';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});


describe('BuildingNameComponent getErrorDescription(value, errorText)', () => {
  let component: BuildingNameComponent;
  let fixture: ComponentFixture<BuildingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the name is undefined or empty.', (inject([Router], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(name => {
      applicationService.model.BuildingName = name;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT display an error message when the name is defined and not empty.', (inject([Router], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.model.BuildingName = 'Building name';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
