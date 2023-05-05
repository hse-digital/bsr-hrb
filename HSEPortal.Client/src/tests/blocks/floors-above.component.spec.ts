import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SectionFloorsAboveComponent } from 'src/app/features/application/sections/floors-above/floors-above.component';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';

let component: SectionFloorsAboveComponent;
let fixture: ComponentFixture<SectionFloorsAboveComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startSectionsEdit();
}

describe('SectionFloorsAboveComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionFloorsAboveComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFloorsAboveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, floorsAbove: any[] }[] = [
    { description: 'should show an error when the floorsAbove is empty.', floorsAbove: [undefined] },
    { description: 'should show an error when the floorsAbove has letters.', floorsAbove: ['abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'] },
    { description: 'should show an error when the floorsAbove has decimals.', floorsAbove: [1.2, 100.5, 0.9999, 1.9999, 999.99999, 500.55, 200.00001] },
    { description: 'should show an error when the floorsAbove is equal or less than cero.', floorsAbove: [0, -1, -100] },
    { description: 'should show an error when the floorsAbove is equal or greater than 1000.', floorsAbove: [1000, 1001, 5000] },
  ]

  testCasesShowError.forEach((test) => {
    new TestHelper()
      .setDescription(test.description)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        setup(applicationService);
        applicationService.currentSection.FloorsAbove = value;
        component.hasErrors = !component.canContinue();
        expect(component.floorsHasError).toBeTrue();
      }, test.floorsAbove).execute();
  });

  new TestHelper()
    .setDescription('should NOT show an error when the floorsAbove greater than 0 and less than 1000.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.FloorsAbove = value;
      component.hasErrors = !component.canContinue();
      expect(component.floorsHasError).toBeFalse();
    }, 1, 3, 100, 150, 500, 999).execute();
});

describe('SectionFloorsAboveComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionFloorsAboveComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFloorsAboveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  new TestHelper()
    .setDescription('should display an error message when the floorsAbove is not valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.FloorsAbove = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toEqual('Error message');
    }, 0, -1, -100, 1.2, 100.5, 1000, 1001, 5000, 0.9999, 1.9999, 999.99999, 500.55, 200.00001, undefined, 'abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#').execute();

  new TestHelper()
    .setDescription('should NOT display an error message when the floorsAbove is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.FloorsAbove = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.floorsHasError, 'Error message')).toBeUndefined();
    }, 1, 3, 5, 100, 999).execute();

});
