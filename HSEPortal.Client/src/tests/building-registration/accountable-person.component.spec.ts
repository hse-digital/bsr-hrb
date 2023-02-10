import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { AccountablePersonComponent } from '../../app/features/application/components/accountable-person/accountable-person.component';
import { BuildingRegistrationService } from '../../app/services/building-registration.service';

let component: AccountablePersonComponent;
let fixture: ComponentFixture<AccountablePersonComponent>;

describe('AccountablePersonComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, BuildingRegistrationService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should show an error when the accountable person is empty or undefined.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(pap => {
      component.buildingRegistrationService.model.AccountablePerson = pap;
      component.saveAndContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT show an error when accountable person exists', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate')
    component.buildingRegistrationService.model.AccountablePerson = '/'
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});

describe('AccountablePersonComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, BuildingRegistrationService]
    }).compileComponents();
    fixture = TestBed.createComponent(AccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the AccountablePerson is undefined.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.buildingRegistrationService.model.AccountablePerson = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the AccountablePerson is valid.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    component.buildingRegistrationService.model.AccountablePerson = '/';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.accountablePersonHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
