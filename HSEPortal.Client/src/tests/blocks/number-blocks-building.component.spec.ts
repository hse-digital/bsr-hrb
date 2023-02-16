import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NumberBlocksBuildingComponent } from 'src/app/features/application/components/building/number-blocks-building/number-blocks-building.component';

let component: NumberBlocksBuildingComponent;
let fixture: ComponentFixture<NumberBlocksBuildingComponent>;


xdescribe('NumberBlocksBuildingComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberBlocksBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler, CaptionService]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberBlocksBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the numberBlocksBuilding is empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
  
    // applicationService.currentBlock. = ;
    component.saveAndContinue();
    expect(component.hasErrors).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT show an error when the value of numberBlocksBuilding is "one" or "two-or-more"',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let numberBlocksBuilding: string[] = ["one", "two-or-more"]
    spyOn(router, 'navigate');
    numberBlocksBuilding.forEach(numberBlocksBuilding => {
      //component.building.numberBlocksBuilding = numberBlocksBuilding;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));
});

xdescribe('NumberBlocksBuildingComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberBlocksBuildingComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler, CaptionService]
    }).compileComponents();
    fixture = TestBed.createComponent(NumberBlocksBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the numberBlocksBuilding is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    // component.building.numberBlocksBuilding = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the numberBlocksBuilding is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let numberBlocksBuilding: string[] = ["one", "two-or-more"]
    spyOn(router, 'navigate');
    numberBlocksBuilding.forEach(numberBlocksBuilding => {
      // component.building.numberBlocksBuilding = numberBlocksBuilding;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.numberBlocksHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});
