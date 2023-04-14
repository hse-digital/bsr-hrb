import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { BuildingNameComponent } from 'src/app/features/new-application/building-name/building-name.component';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';

describe('BuildingNameComponent showError', () => {
  let component: BuildingNameComponent;
  let fixture: ComponentFixture<BuildingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, name?: string }[] = [
    { description: 'should show an error when the name is empty.', name: '' },
    { description: 'should show an error when the name is undefined.', name: undefined },
  ];

  testCasesShowError.forEach((test) => {
    new TestHelper()
      .setDescription(test.description)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        applicationService.newApplication();
        applicationService.model.BuildingName = value;
        component.hasErrors = !component.canContinue();
        expect(component.nameHasErrors).toBeTrue();
      }, test.name).execute();
  });

  new TestHelper()
    .setDescription('should NOT show an error when the name is defined and not empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.BuildingName = value;
      component.hasErrors = !component.canContinue();
      expect(component.nameHasErrors).toBeFalse();
    }, 'Building name').execute();

});


describe('BuildingNameComponent getErrorDescription(value, errorText)', () => {
  let component: BuildingNameComponent;
  let fixture: ComponentFixture<BuildingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  new TestHelper()
    .setDescription('should display an error message when the name is undefined or empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.BuildingName = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toEqual('Error message');
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT display an error message when the name is defined and not empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.model.BuildingName = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.nameHasErrors, 'Error message')).toBeUndefined();
    }, 'Building name').execute();

});
