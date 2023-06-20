import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApAddressComponent } from 'src/app/features/application/accountable-person/ap-address/ap-address.component';


import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';

let component: AddAccountablePersonComponent;
let fixture: ComponentFixture<AddAccountablePersonComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startNewAccountablePerson();
  applicationService.startAccountablePersonEdit();

  fixture = TestBed.createComponent(AddAccountablePersonComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
}

describe('AddAccountablePersonComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAccountablePersonComponent, ApAddressComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

  });

  it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
    setup(applicationService);
    expect(component).toBeTruthy();
  }));

  new TestHelper()
    .setDescription('Should show an error when addAccountablePerson is empty or undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentAccountablePerson.AddAnother = value;
      component.hasErrors = !component.canContinue();
      expect(component.hasErrors).toBeTrue();
      expect(component.addAccountablePersonHasError).toBeTrue();
    }, "", undefined).execute();

  new TestHelper()
    .setDescription('Should NOT show an error when addAccountablePerson is empty or undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentAccountablePerson.AddAnother = value;
      component.hasErrors = !component.canContinue();
      expect(component.hasErrors).toBeFalse();
      expect(component.addAccountablePersonHasError).toBeFalse();
    }, "yes", "no").execute();
});
