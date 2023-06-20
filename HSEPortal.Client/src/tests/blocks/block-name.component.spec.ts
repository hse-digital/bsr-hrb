import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { SectionNameComponent } from 'src/app/features/application/building-summary/name/name.component';

let component: SectionNameComponent;
let fixture: ComponentFixture<SectionNameComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startSectionsEdit();
  component.ngOnInit();
}

describe('SectionNameComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionNameComponent,],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError: { description: string, name?: string }[] = [
    { description: 'should show an error when the blockName is empty.', name: '' },
    { description: 'should show an error when the blockName is undefined.', name: undefined },
  ];

  testCasesShowError.forEach((test) => {
    new TestHelper()
      .setDescription(test.description)
      .setTestCase((applicationService: ApplicationService, value: any) => {
        setup(applicationService);
        applicationService.currentSection.Name = value;
        component.hasErrors = !component.canContinue();
        expect(component.blockNameHasErrors).toBeTrue();
      }, test.name).execute();
  });

  new TestHelper()
    .setDescription('should NOT show an error when the blockName is defined and not empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Name = value;
      component.hasErrors = !component.canContinue();
      expect(component.blockNameHasErrors).toBeFalse();
    }, 'Block name').execute();

});

describe('SectionNameComponent getErrorDescription(value, errorText)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionNameComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  new TestHelper()
    .setDescription('should display an error message when the blockName is undefined or empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Name = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toEqual('Error message');
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT display an error message when the blockName is defined and not empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.Name = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeUndefined();
    }, 'Block name').execute();
});
