import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestHelper } from 'src/tests/test-helper';
import { OrganisationTypeComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component';

let component: OrganisationTypeComponent;
let fixture: ComponentFixture<OrganisationTypeComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startNewAccountablePerson();
  applicationService.startAccountablePersonEdit();

  fixture = TestBed.createComponent(OrganisationTypeComponent);
  component = fixture.componentInstance;
  applicationService.currentAccountablePerson.OrganisationType = "";

  fixture.detectChanges();
}

describe('OrganisationTypeComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationTypeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
    setup(applicationService);
    expect(component).toBeTruthy();
  }));

  new TestHelper()
    .setDescription('Should show an error when the organisation type is undefined or empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentAccountablePerson.OrganisationType = value;
      component.hasErrors = !component.canContinue()
      expect(component.hasErrors).toBeTrue();
      expect(component.organisationTypeHasErrors).toBeTrue();
    }, undefined, "").execute();

  new TestHelper()
    .setDescription('Should NOT show an error when the organisation type is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentAccountablePerson.OrganisationType = value;
      component.hasErrors = !component.canContinue()
      expect(component.hasErrors).toBeFalse();
      expect(component.organisationTypeHasErrors).toBeFalse();
    }, "commonhold-association", "housing-association", "local-authority").execute();

  new TestHelper()
    .setDescription('Should show an error when the organisation type is other, but OrganisationTypeDescription is empty or undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentAccountablePerson.OrganisationType = "other";
      applicationService.currentAccountablePerson.OrganisationTypeDescription = value;
      component.hasErrors = !component.canContinue()
      expect(component.hasErrors).toBeTrue();
      expect(component.organisationTypeHasErrors).toBeTrue();
    }, "", undefined).disabled();

});