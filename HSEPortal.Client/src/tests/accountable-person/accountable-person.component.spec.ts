import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { AccountablePersonComponent } from 'src/app/features/application/accountable-person/accountable-person/accountable-person.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TestHelper } from '../test-helper';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let httpTestingController: HttpTestingController;
let component: AccountablePersonComponent;
let fixture: ComponentFixture<AccountablePersonComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.model.AccountablePersons = [new AccountablePersonModel()]
}

describe('AccountablePersonComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
      providers: [ApplicationService]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  new TestHelper()
    .setDescription('should show an error when the accountable person is empty or undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.model.PrincipalAccountableType = value;
      component.hasErrors = !component.canContinue();
      expect(component.accountablePersonHasErrors).toBeTrue();
      httpTestingController.match(`api/UpdateApplication/undefined`);
      httpTestingController.verify();
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT show an error when accountable person exists.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.model.PrincipalAccountableType = value;
      component.hasErrors = !component.canContinue();
      expect(component.accountablePersonHasErrors).toBeFalse();

      httpTestingController.match(`api/UpdateApplication/undefined`);
      httpTestingController.verify();
    }, 'organisation').execute();
});

describe('AccountablePersonComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
      providers: [ApplicationService]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(AccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  new TestHelper()
    .setDescription('should display an error message when the AccountablePerson is undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.model.PrincipalAccountableType = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toEqual('Error message');
      httpTestingController.match(`api/UpdateApplication/undefined`);
      httpTestingController.verify();
    }, undefined).execute();
  
  new TestHelper()
    .setDescription('should NOT display an error message when the AccountablePerson is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.model.PrincipalAccountableType = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toBeUndefined();
      httpTestingController.match(`api/UpdateApplication/undefined`);
      httpTestingController.verify();
    }, 'individual').execute();
});
