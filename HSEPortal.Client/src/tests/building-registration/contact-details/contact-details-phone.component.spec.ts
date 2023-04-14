import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { ContactPhoneComponent } from 'src/app/features/new-application/contact-phone/contact-phone.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: ContactPhoneComponent;
let fixture: ComponentFixture<ContactPhoneComponent>;

describe('ContactDetailsPhoneComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactPhoneComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(ContactPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError = [
    { description: 'should show an error when phone number is empty.', phoneNumbers: [''] },
    { description: 'should show an error when the phone number has letters.', phoneNumbers: ['+4412345678ab'] },
    { description: 'should show an error when the phone number does not have a valid prefix.', phoneNumbers: ['1234567890'] },
    { description: 'should show an error when the phone number does not have 10 digits.', phoneNumbers: ['+4412345', '+441234567890123456'] },
  ]

  testCasesShowError.forEach((test) => {

    it(test.description, (inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.phoneNumbers?.forEach((number) => {
        applicationService.model.ContactPhoneNumber = number;
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));

  });

  let testCasesNoShowError = [
    { description: 'should NOT show an error when the phone number is valid.', phoneNumbers: ['+441234567890', '01234567890'] },
    { description: 'should NOT show an error when the phone number has white spaces.', phoneNumbers: ['+44 123 4 567 890', '0 1234 5 6       7  8   9  0    '] },
  ]

  testCasesNoShowError.forEach((test) => {

    it(test.description, (inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.phoneNumbers?.forEach((number) => {
        applicationService.model.ContactPhoneNumber = number;
        component.saveAndContinue();
        expect(component.hasErrors).toBeFalse();
        expect(router.navigate).toHaveBeenCalled();
      });
    })));
  });

});

describe('ContactDetailsPhoneComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactPhoneComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(ContactPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when phone number is not valid.', (inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let phoneNumbers = ['', 'abcdef', '1234567890', '+441234', '+441234567890123456789', '+4412345abc90'];
    
    spyOn(router, 'navigate');
    phoneNumbers.forEach(number => {
      applicationService.model.ContactPhoneNumber = number;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.phoneNumberHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.phoneNumberHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display an error message when phone number is valid.', (inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let phoneNumbers = ['+441234567890', '01234567890'];

    spyOn(router, 'navigate');
    phoneNumbers.forEach(number => {
      applicationService.model.ContactPhoneNumber = number;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.phoneNumberHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });

  })));

});
