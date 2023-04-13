import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { SectionNameComponent } from 'src/app/features/application/sections/name/name.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: SectionNameComponent;
let fixture: ComponentFixture<SectionNameComponent>;


describe('BlockNameComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionNameComponent, ],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, name?: string }[] = [
    { description: 'should show an error when the blockName is empty.', name: '' },
    { description: 'should show an error when the blockName is undefined.', name: undefined },
  ];

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      applicationService.newApplication();
      applicationService.currentSection.Name = test.name;
      component.hasErrors = !component.canContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the blockName is defined and not empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentSection.Name = 'Block name';
    component.hasErrors = !component.canContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});


describe('BlockNameComponent getErrorDescription(value, errorText)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionNameComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the blockName is undefined or empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(name => {
      applicationService.newApplication();
      applicationService.currentSection.Name = name;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT display an error message when the blockName is defined and not empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentSection.Name = 'Block name';
    component.hasErrors = !component.canContinue();
    expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
