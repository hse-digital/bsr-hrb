import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { SectionHeightComponent } from 'src/app/features/application/sections/height/height.component';
import { ApplicationService } from 'src/app/services/application.service';
import { TestEnds, TestHelper } from '../test-helper';
import { ComponentsModule } from 'src/app/components/components.module';

let component: SectionHeightComponent;
let fixture: ComponentFixture<SectionHeightComponent>;

describe('SectionHeightComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionHeightComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    new TestHelper().setComponent(component)
      .setDescription(test.description)
      .setTestEnd(TestEnds.Errors)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        applicationService.newApplication();
        applicationService.startSectionsEdit();
        applicationService.currentSection.Height = value;
        component.hasErrors = component.canContinue();
      }, test.heights).execute();
  });

  new TestHelper().setComponent(component)
    .setDescription('should NOT show an error when the height greater than 2 and less than 1000.')
    .setTestEnd(TestEnds.Success)
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.startSectionsEdit();
      applicationService.currentSection.Height = value;
      component.hasErrors = component.canContinue();
    }, [3, 100, 150.5, 500, 999, 999.9, 999.9999]).execute();
});

describe('SectionHeightComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionHeightComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  new TestHelper().setComponent(component)
    .setDescription('should display an error message when the height is not valid.')
    .setTestEnd(TestEnds.ErrorMessages)
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.startSectionsEdit();
      applicationService.currentSection.Height = value;
      component.hasErrors = component.canContinue();
    }, [0, 1, 2, 2.9999, 1000, 1000.01, 1001, 1500.5, 5000, undefined, 'abc', '123abc12', '1-2', '123?']).execute();

  new TestHelper().setComponent(component)
    .setDescription('should NOT display an error message when the height is valid.')
    .setTestEnd(TestEnds.NotErrorMessages)
    .setTestCase((applicationService: ApplicationService, value: any) => {
      applicationService.newApplication();
      applicationService.startSectionsEdit();
      applicationService.currentSection.Height = value;
      component.hasErrors = component.canContinue();
    }, [3, 100, 150.5, 500, 999, 999.9, 999.9999]).execute();

});
