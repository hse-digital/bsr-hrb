import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';


import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { SectionPeopleLivingInBuildingComponent } from 'src/app/features/application/building-summary/people-living-in-building/people-living-in-building.component';

let component: SectionPeopleLivingInBuildingComponent;
let fixture: ComponentFixture<SectionPeopleLivingInBuildingComponent>;

function setup(applicationService: ApplicationService) {
  applicationService.newApplication();
  applicationService.startSectionsEdit();
  
  fixture.detectChanges();
}

describe('SectionPeopleLivingInBuildingComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionPeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionPeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  new TestHelper()
    .setDescription('should show an error when the peopleLivingInBuilding is empty')
    .setTestCase((applicationService: ApplicationService, value?: any) => {
      setup(applicationService);
      applicationService.currentSection.PeopleLivingInBuilding = value;
      component.hasErrors = !component.canContinue();
      expect(component.peopleLivingHasErrors).toBeTrue();
    }, undefined).execute();

  new TestHelper()
    .setDescription('should NOT show an error when the value of peopleLivingInBuilding is "yes", "no_block_ready" or "no_wont_move"')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.PeopleLivingInBuilding = value;
      component.hasErrors = !component.canContinue();
      expect(component.peopleLivingHasErrors).toBeFalse();
    }, "yes", "no_block_ready", "no_wont_move").execute();
});

describe('SectionPeopleLivingInBuildingComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionPeopleLivingInBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();
    fixture = TestBed.createComponent(SectionPeopleLivingInBuildingComponent);
    component = fixture.componentInstance;
  });

  new TestHelper()
    .setDescription('should display an error message when the peopleLivingInBuilding is not valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.PeopleLivingInBuilding = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toEqual('Error message');
    }, undefined).execute();


  new TestHelper()
    .setDescription('should NOT display an error message when the peopleLivingInBuilding is valid.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      setup(applicationService);
      applicationService.currentSection.PeopleLivingInBuilding = value;
      component.hasErrors = !component.canContinue();
      expect(component.getErrorDescription(component.peopleLivingHasErrors, 'Error message')).toBeUndefined();
    }, "yes", "no_block_ready", "no_wont_move").execute();
});
