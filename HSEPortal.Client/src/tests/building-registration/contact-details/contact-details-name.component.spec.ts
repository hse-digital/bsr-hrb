import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ContactDetailsNameComponent } from '../../../app/building-registration/contact-details/contact-details-name/contact-details-name.component';
import { BuildingRegistrationService } from '../../../app/services/building-registration/building-registration.service';


describe('ContactDetailsNameComponent showError', () => {
  let component: ContactDetailsNameComponent;
  let fixture: ComponentFixture<ContactDetailsNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsNameComponent);
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
    it(test.description, async(inject([Router], (router: any) => {
      spyOn(router, 'navigate');
      component.contactDetails.firstName = test.firstName;
      component.contactDetails.lastName = test.lastName;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the first and last name are defined and not empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.contactDetails.firstName = 'FirstName';
    component.contactDetails.lastName = 'LastName';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});

describe('ContactDetailsNameComponent getErrorDescription(value, errorText)', () => {

  let component: ContactDetailsNameComponent;
  let fixture: ComponentFixture<ContactDetailsNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the first name error message.', async(inject([Router], (router: any) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: undefined, lastName: undefined },
      { firstName: '', lastName: 'LastName' },
      { firstName: undefined, lastName: 'LastName' },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      component.contactDetails.firstName = contact.firstName;
      component.contactDetails.lastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should display the last name error message.', async(inject([Router], (router: any) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: undefined, lastName: undefined },
      { firstName: 'FirstName', lastName: '' },
      { firstName: 'FirstName', lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      component.contactDetails.firstName = contact.firstName;
      component.contactDetails.lastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should display the error messages when the contact details are not valid.', async(inject([Router], (router: any) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: '' },
      { firstName: '', lastName: undefined },
      { firstName: undefined, lastName: '' },
      { firstName: undefined, lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      component.contactDetails.firstName = contact.firstName;
      component.contactDetails.lastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display the error messages when the contact details are valid.', async(inject([Router], (router: any) => {

    spyOn(router, 'navigate');
    component.contactDetails.firstName = 'FirstName';
    component.contactDetails.lastName = 'LastName';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
    expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();

  })));

  it('should only display the last name error message.', async(inject([Router], (router: any) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: 'FirstName', lastName: '' },
      { firstName: 'FirstName', lastName: undefined },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      component.contactDetails.firstName = contact.firstName;
      component.contactDetails.lastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));


  it('should only display the first name error message.', async(inject([Router], (router: any) => {

    let contactDetails: { firstName?: string, lastName?: string }[] = [
      { firstName: '', lastName: 'LastName' },
      { firstName: undefined, lastName: 'LastName' },
    ]

    spyOn(router, 'navigate');
    contactDetails.forEach(contact => {
      component.contactDetails.firstName = contact.firstName;
      component.contactDetails.lastName = contact.lastName;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

});
