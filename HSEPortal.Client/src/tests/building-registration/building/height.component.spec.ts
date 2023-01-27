import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { BuildingHeightComponent } from '../../../app/building-registration/building/height/height.component';

let component: BuildingHeightComponent;
let fixture: ComponentFixture<BuildingHeightComponent>;

describe('BuildingHeightComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingHeightComponent],
      imports: [RouterTestingModule, HseAngularModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingHeightComponent);
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
    it(test.description, async(inject([Router], (router: any) => {
      spyOn(router, 'navigate');
      test.heights?.forEach((height) => {
        component.building.height = height;
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));
  });

  it('should NOT show an error when the height greater than 2 and less than 1000.', async(inject([Router], (router: any) => {
    let heights: number[] = [3, 100, 150.5, 500, 999, 999.9, 999.9999]
    spyOn(router, 'navigate');
    heights.forEach(height => {
      component.building.height = height;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});

describe('BuildingHeightComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingHeightComponent],
      imports: [RouterTestingModule, HseAngularModule],
    }).compileComponents();
    fixture = TestBed.createComponent(BuildingHeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the height is not valid.', async(inject([Router], (router: any) => {
    let wrongHeights: any = [0, 1, 2, 2.9999, 1000, 1000.01, 1001, 1500.5, 5000, undefined, 'abc', '123abc12', '1-2', '123?'];

    spyOn(router, 'navigate');
    wrongHeights.forEach( (height: any) => {
      component.building.height = height;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT display an error message when the height is valid.', async(inject([Router], (router: any) => {

    let heights: number[] = [3, 100, 150.5, 500, 999, 999.9, 999.9999]

    spyOn(router, 'navigate');
    heights.forEach(height => {
      component.building.height = height;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.heightHasErrors, 'Error message')).toBeUndefined();
      expect(router.navigate).toHaveBeenCalled();
    });

  })));

});
