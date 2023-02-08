import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { BlockNameComponent } from '../../../app/building-registration/building/block-name/block-name.component';
import { CaptionService } from '../../../app/building-registration/building/caption.service';
import { BlockRegistrationService } from '../../../app/services/building-registration/block-registration.service';

let component: BlockNameComponent;
let fixture: ComponentFixture<BlockNameComponent>;

describe('BlockNameComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, BlockRegistrationService, HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockNameComponent);
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
    it(test.description, async(inject([Router], (router: any) => {
      spyOn(router, 'navigate');
      component.building.blockName = test.name;
      component.saveAndContinue()
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    })));
  });

  it('should NOT show an error when the blockName is defined and not empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.blockName = 'Block name';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});


describe('BlockNameComponent getErrorDescription(value, errorText)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockNameComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, BlockRegistrationService, HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlockNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the blockName is undefined or empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(name => {
      component.building.blockName = name;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT display an error message when the blockName is defined and not empty.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.building.blockName = 'Block name';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.blockNameHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
