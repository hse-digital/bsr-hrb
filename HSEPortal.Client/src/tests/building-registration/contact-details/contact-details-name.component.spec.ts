import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContactNameComponent } from 'src/app/features/new-application/contact-name/contact-name.component';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';

describe('ContactNameComponent showError', () => {
  let component: ContactNameComponent;
  let fixture: ComponentFixture<ContactNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactNameComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
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
    new TestHelper()
      .setDescription(test.description)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        applicationService.newApplication();
        applicationService.model.ContactFirstName = value.firstName;
        applicationService.model.ContactLastName = value.lastName;
        component.hasErrors = !component.canContinue();
        expect(component.hasErrors).toBeTrue();
      }, { firstName: test.firstName, lastName: test.lastName }).execute();
  });

  new TestHelper()
    .setDescription('should NOT show an error when the first and last name are defined and not empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.hasErrors).toBeFalse();
    }, { firstName: 'FirstName', lastName: 'LastName' }).execute();
});

describe('ContactNameComponent getErrorDescription(value, errorText)', () => {

  let component: ContactNameComponent;
  let fixture: ComponentFixture<ContactNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactNameComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let contactDetailsFirstName: { firstName?: string, lastName?: string }[] = [
    { firstName: '', lastName: '' },
    { firstName: undefined, lastName: undefined },
    { firstName: '', lastName: 'LastName' },
    { firstName: undefined, lastName: 'LastName' },
  ]

  new TestHelper()
    .setDescription('should display the first name error message.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
    }, ...contactDetailsFirstName).execute();

  let contactDetailsLastName: { firstName?: string, lastName?: string }[] = [
    { firstName: '', lastName: '' },
    { firstName: undefined, lastName: undefined },
    { firstName: 'FirstName', lastName: '' },
    { firstName: 'FirstName', lastName: undefined },
  ]

  new TestHelper()
    .setDescription('should display the last name error message.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
    }, ...contactDetailsLastName).execute();

  let contactDetails: { firstName?: string, lastName?: string }[] = [
    { firstName: '', lastName: '' },
    { firstName: '', lastName: undefined },
    { firstName: undefined, lastName: '' },
    { firstName: undefined, lastName: undefined },
  ]

  new TestHelper()
    .setDescription('should display the error messages when the contact details are not valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
    }, ...contactDetails).execute();

  new TestHelper()
    .setDescription('should NOT display the error messages when the contact details are valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
    }, { firstName: 'FirstName', lastName: 'LastName' }).execute();

  let contactDetailsUndefined: { firstName?: string, lastName?: string }[] = [
    { firstName: 'FirstName', lastName: '' },
    { firstName: 'FirstName', lastName: undefined },
  ]

  new TestHelper()
    .setDescription('should only display the last name error message.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toEqual('Error message');
    }, ...contactDetailsUndefined).execute();

  let contactDetailsFirstnameUndefined: { firstName?: string, lastName?: string }[] = [
    { firstName: '', lastName: 'LastName' },
    { firstName: undefined, lastName: 'LastName' },
  ]

  new TestHelper()
    .setDescription('should only display the first name error message.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.ContactFirstName = value.firstName;
      applicationService.model.ContactLastName = value.lastName;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.lastNameInError, 'Error message')).toBeUndefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.firstNameInError, 'Error message')).toEqual('Error message');
    }, ...contactDetailsFirstnameUndefined).execute();

});
