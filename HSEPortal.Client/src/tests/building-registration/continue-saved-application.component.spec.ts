import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ApplicationContinueComponent } from '../../app/features/application/components/application-continue/application-continue.component';
import { ApplicationService } from '../../app/services/application.service';

let component: ApplicationContinueComponent;
let fixture: ComponentFixture<ApplicationContinueComponent>;


xdescribe('ApplicationContinueComponent showError', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationContinueComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError = [
    { description: 'should show an error when the application number is empty or undefined.', applicationNumber: ['', undefined] },
    { description: 'should show an error when the application number does not have 12 digits.', applicationNumber: ['4412345', '441234567890123456'] },
  ]

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.applicationNumber?.forEach((number) => {
        applicationService.model.id = number;
        applicationService.model.ContactEmailAddress = 'validemailaddress@abcd.com';
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));
  });

  it('should show an error when the email address is empty or undefined.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    ['', undefined].forEach((email) => {
      applicationService.model.id = '000123456789';
      //component.building.emailAddress = email;
      component.saveAndContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  let testCasesShowErrorEmailAndAppNumber = [
    { description: 'should show an error when the email and the application number are empty.', email: '', applicationNumber: '' },
    { description: 'should show an error when the email and the application number are undefined.', email: undefined, applicationNumber: undefined },
    { description: 'should show an error when the email is empty but application number is valid.', email: '', applicationNumber: '000123456789' },
    { description: 'should show an error when the application number is empty but email is valid.', email: 'email@abcd.com', applicationNumber: '' },
    { description: 'should show an error when the length of the application number is less than 12 but the email is valid.', email: 'email@abcd.com', applicationNumber: '01234' },
    { description: 'should show an error when the length of the application number is greater than 12 but the email is valid.', email: 'email@abcd.com', applicationNumber: '0001234456789000111222333' },
  ];

  testCasesShowErrorEmailAndAppNumber.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      applicationService.model.id = test.applicationNumber;
      //component.building.emailAddress = test.email;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });


  it('should NOT show an error when the application number and the email are valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.model.id = '000123456789';
    //component.building.emailAddress = 'validemailaddress@abcd.com';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});

xdescribe('ApplicationContinueComponent getErrorDescription(value, errorText)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationContinueComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the error messages when the email address and the application number are not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let emailAndAppNumber: { emailAddress?: string, applicationNumber?: string }[] = [
      { emailAddress: '', applicationNumber: '' },
      { emailAddress: '', applicationNumber: undefined },
      { emailAddress: undefined, applicationNumber: '' },
      { emailAddress: undefined, applicationNumber: undefined },
      { emailAddress: '', applicationNumber: '01234' },
      { emailAddress: undefined, applicationNumber: '012345678963214587' },
    ]

    spyOn(router, 'navigate');
    emailAndAppNumber.forEach(test => {
      //component.building.emailAddress = test.emailAddress;
      applicationService.model.id = test.applicationNumber;
      component.saveAndContinue();
      //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toBeDefined();
      //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toEqual('Error message');
      //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toBeDefined();
      //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display the error messages when the contact details are valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    //component.building.emailAddress = 'validemailaddress@abcd.com';
    //component.building.applicationNumber = '000123456789';
    component.saveAndContinue();
    //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toBeUndefined();
    //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

  it('should only display the email addresss error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let emailAndAppNumber: { emailAddress?: string, applicationNumber?: string }[] = [
      { emailAddress: '', applicationNumber: '000123456789' },
      { emailAddress: undefined, applicationNumber: '000123456789' },
    ]

    spyOn(router, 'navigate');
    emailAndAppNumber.forEach(test => {
      //component.building.emailAddress = test.emailAddress;
      //component.building.applicationNumber = test.applicationNumber;
      component.saveAndContinue();
      //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toBeUndefined();
      //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toBeDefined();
      //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should only display the application number error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let emailAndAppNumber: { emailAddress?: string, applicationNumber?: string }[] = [
      { emailAddress: 'validemailaddress@abcd.com', applicationNumber: '00012' },
      { emailAddress: 'validemailaddress@abcd.com', applicationNumber: '0001234567899875413652' },
      { emailAddress: 'validemailaddress@abcd.com', applicationNumber: '' },
      { emailAddress: 'validemailaddress@abcd.com', applicationNumber: undefined },
    ]

    spyOn(router, 'navigate');
    emailAndAppNumber.forEach(test => {
      //component.building.emailAddress = test.emailAddress;
      //component.building.applicationNumber = test.applicationNumber;
      component.saveAndContinue();
      //expect(component.getErrorDescription(component.errors.emailAddress.hasError, 'Error message')).toBeUndefined();
      //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toBeDefined();
      //expect(component.getErrorDescription(component.errors.applicationNumber.hasError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

});
