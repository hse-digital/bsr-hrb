import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddMoreSectionsComponent } from 'src/app/features/application/building-summary/add-more-sections/add-more-sections.component';

import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';

let component: AddMoreSectionsComponent;
let fixture: ComponentFixture<AddMoreSectionsComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.model.Sections = [new SectionModel(), new SectionModel()]

  fixture = TestBed.createComponent(AddMoreSectionsComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
}

describe('AddMoreSectionsComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMoreSectionsComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();
  });

  it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
    setup(applicationService);
    expect(component).toBeTruthy();
  }));

  new TestHelper()
    .setDescription('should show an error when the addAnotherSectionLink is empty.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      component.addAnotherSectionLink = value;
      component.hasErrors = !component.canContinue();
      expect(component.anotherBlockHasErrors).toBeTrue();      
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT show an error when the value of addAnotherSectionLink is "yes" or "no"')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      component.addAnotherSectionLink = value;
      component.hasErrors = !component.canContinue();
      expect(component.anotherBlockHasErrors).toBeFalse();      
    }, "yes", "no").execute();

});

describe('AddMoreSectionsComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMoreSectionsComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

  });

  new TestHelper()
    .setDescription('should display an error message when the addAnotherSectionLink is not valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      component.addAnotherSectionLink = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toEqual('Error message'); 
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT display an error message when the addAnotherSectionLink is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      component.addAnotherSectionLink = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toBeUndefined();
    }, "yes", "no").execute();
});
