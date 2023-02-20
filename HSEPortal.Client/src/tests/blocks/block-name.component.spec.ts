import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { CaptionService } from 'src/app/services/caption.service';
import { NameComponent } from 'src/app/features/application/blocks/name/name.component';
import { ApplicationService } from '../../app/services/application.service';

let component: NameComponent;
let fixture: ComponentFixture<NameComponent>;


describe('BlockNameComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameComponent, ],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, ApplicationService, HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NameComponent);
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
      applicationService.currentBlock.Name = test.name;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the blockName is defined and not empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentBlock.Name = 'Block name';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});


describe('BlockNameComponent getErrorDescription(value, errorText)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, ApplicationService, HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the blockName is undefined or empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(name => {
      applicationService.newApplication();
      applicationService.currentBlock.Name = name;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT display an error message when the blockName is defined and not empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentBlock.Name = 'Block name';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
