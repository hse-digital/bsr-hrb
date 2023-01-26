import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { ContactDetailsPhoneComponent } from '../../../app/building-registration/contact-details/contact-details-phone/contact-details-phone.component';


describe('ContactDetailsPhoneComponent showError', () => {
  let component: ContactDetailsPhoneComponent;
  let fixture: ComponentFixture<ContactDetailsPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsPhoneComponent],
      imports: [RouterModule.forRoot([]), HseAngularModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactDetailsPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError = [
    { description: 'should show an error when phone number is empty', phoneNumbers: [''] },
    { description: 'should show an error when the phone number has letters', phoneNumbers: ['+4412345678ab'] },
    { description: 'should show an error when the phone number does not have a valid prefix.', phoneNumbers: ['1234567890'] },
    { description: 'should show an error when the phone number does not have 10 digits.', phoneNumbers: ['+4412345', '+441234567890123456'] },
  ]

  testCasesShowError.forEach((test) => {
    it(test.description, () => {
      test.phoneNumbers?.forEach((number) => {

        component.contactDetails.phoneNumber = number;
        component.updateErrorStatus();
        expect(component.showError).toBeTrue();

      });
    });
  });


  let testCasesNoShowError = [
    { description: 'should NOT show an error when the phone number is valid.', phoneNumbers: ['+441234567890', '01234567890'] },
    { description: 'should NOT show an error when the phone number has white spaces.', phoneNumbers: ['+44 123 4 567 890', '0 1234 5 6       7  8   9  0    '] },
  ]

  testCasesNoShowError.forEach((test) => {
    it(test.description, () => {
      test.phoneNumbers?.forEach((number) => {

        component.contactDetails.phoneNumber = number;
        component.updateErrorStatus();
        expect(component.showError).toBeFalse();

      });
    });
  });

});

describe('ContactDetailsPhoneComponent getContinuesLink()', () => {
  let component: ContactDetailsPhoneComponent;
  let fixture: ComponentFixture<ContactDetailsPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsPhoneComponent],
      imports: [RouterModule.forRoot([]), HseAngularModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactDetailsPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should NOT give a continueLink when phone number is not valid.', () => {

    let phoneNumbers = ['', 'abcdef', '1234567890', '+441234', '+441234567890123456789', '+4412345abc90'];

    phoneNumbers.forEach(number => {
      component.contactDetails.phoneNumber = number;
      expect(component.getContinueLink()).toBeUndefined();
    });

  });

  it('should give a continueLink when phone number is valid.', () => {

    let phoneNumbers = ['+441234567890', '01234567890'];

    phoneNumbers.forEach(number => {
      component.contactDetails.phoneNumber = number;
      expect(component.getContinueLink()).toBeDefined();
      expect(component.getContinueLink()?.length).toBeGreaterThan(0);
    });
  });

});
