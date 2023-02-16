import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ContactNameComponent } from 'src/app/features/application/new-application/contact-name/contact-name.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: ContactNameComponent;
let fixture: ComponentFixture<ContactNameComponent>;


describe('ContactDetailsNameComponent showError', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, firstName?: string, lastName?: string }[] = [
    { description: 'should show an error when first and last name are empty.', firstName: '', lastName: '' },
    { description: 'should show an error when first and last name are undefined.', firstName: undefined, lastName: undefined },
    { description: 'should show an error when first name is empty.', firstName: 'FirstName', lastName: '' },
    { description: 'should show an error when last name is empty.', firstName: '', lastName: 'LastName' },
  ];

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      applicationService.model.ContactFirstName = test.firstName;
      applicationService.model.ContactLastName = test.lastName;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the first and last name are defined and not empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.model.ContactFirstName = 'FirstName';
    applicationService.model.ContactLastName = 'LastName';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});

describe('ContactNameComponent getErrorDescription(value, errorText)', () => {

  let component: ContactNameComponent;
  let fixture: ComponentFixture<ContactNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the first name error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: undefined, lastName: undefined },
      { firstName: '', lastName: 'LastName' },
      { firstName: undefined, lastName: 'LastName' },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      applicationService.model.ContactFirstName = contact.firstName;
      applicationService.model.ContactLastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should display the last name error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: undefined, lastName: undefined },
      { firstName: 'FirstName', lastName: '' },
      { firstName: 'FirstName', lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      applicationService.model.ContactFirstName = contact.firstName;
      applicationService.model.ContactLastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should display the error messages when the contact details are not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: '', lastName: undefined },
      { firstName: undefined, lastName: '' },
      { firstName: undefined, lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      applicationService.model.ContactFirstName = contact.firstName;
      applicationService.model.ContactLastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display the error messages when the contact details are valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    spyOn(router, 'navigate');
    applicationService.model.ContactFirstName = 'FirstName';
    applicationService.model.ContactLastName = 'LastName';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
    expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();

  })));

  it('should only display the last name error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: 'FirstName', lastName: '' },
      { firstName: 'FirstName', lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      applicationService.model.ContactFirstName = contact.firstName;
      applicationService.model.ContactLastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));


  it('should only display the first name error message.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: 'LastName' },
      { firstName: undefined, lastName: 'LastName' },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      applicationService.model.ContactFirstName = contact.firstName;
      applicationService.model.ContactLastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

});
