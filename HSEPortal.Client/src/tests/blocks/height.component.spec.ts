import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { ComponentsModule } from 'src/app/components/components.module';
import { SectionHeightComponent } from 'src/app/features/application/building-summary/height/height.component';

let component: SectionHeightComponent;
let fixture: ComponentFixture<SectionHeightComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startSectionsEdit();

  fixture.detectChanges();
}

describe('SectionHeightComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionHeightComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeightComponent);
    component = fixture.componentInstance;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, heights: any[] }[] = [
    { description: 'should show an error when the height is empty.', heights: [undefined] },
    { description: 'should show an error when the height less than two.', heights: [0, 1, 2, 2.9999] },
    { description: 'should show an error when the height has letters.', heights: ['abc', '10a', '1f2', '123!', '1,2', '22-33', '78?', '#'] },
    { description: 'should show an error when the height is equal or greater than 1000.', heights: [1000, 1000.01, 1001, 1500.5, 5000] },
  ]

  testCasesShowError.forEach((test) => {
    new TestHelper()
      .setDescription(test.description)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        setup(applicationService);
        applicationService.currentSection.Height = value;
        component.hasErrors = !component.canContinue();
        expect(component.heightHasErrors).toBeTrue();
      }, test.heights).execute();
  });

  new TestHelper()
    .setDescription('should NOT show an error when the height greater than 2 and less than 1000.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Height = value;
      component.hasErrors = !component.canContinue();
      expect(component.heightHasErrors).toBeFalse();
    }, 3, 100, 150.5, 500, 999, 999.9, 999.9999).execute();
});

describe('SectionHeightComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionHeightComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeightComponent);
    component = fixture.componentInstance;

  });

  new TestHelper()
    .setDescription('should display an error message when the height is not valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Height = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toEqual('Error message');
    }, 0, 1, 2, 2.9999, 1000, 1000.01, 1001, 1500.5, 5000, undefined, 'abc', '123abc12', '1-2', '123?').execute();

  new TestHelper()
    .setDescription('should NOT display an error message when the height is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Height = value;      
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toBeUndefined();
    }, 3, 100, 150.5, 500, 999, 999.9, 999.9999).execute();

});
