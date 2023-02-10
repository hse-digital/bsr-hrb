import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { AccountablePersonComponent } from '../../app/features/application/components/accountable-person/accountable-person.component';
import { BlockRegistrationService } from '../../app/services/block-registration.service';


describe('AccountablePersonComponent', () => {
  let component: AccountablePersonComponent;
  let fixture: ComponentFixture<AccountablePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, BlockRegistrationService]
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
      component.building.accountablePerson = pap;
      component.saveAndContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT show an error when accountable person exists', async(inject([Router], (router: any) => {
    spyOn(router,'navigate')
    component.building.accountablePerson = '/'
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
