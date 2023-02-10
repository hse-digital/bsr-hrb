import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { OtherAccountablePersonComponent } from '../../app/features/application/components/other-accountable-person/other-accountable-person.component';
import { BuildingRegistrationService } from '../../app/services/building-registration.service';

describe('OtherAccountablePersonComponent showError', () => {
  let component: OtherAccountablePersonComponent;
  let fixture: ComponentFixture<OtherAccountablePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherAccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, BuildingRegistrationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherAccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the OtherAccountablePerson is empty or undefined.', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(pap => {
      component.buildingRegistrationService.model.OtherAccountablePerson = pap;
      component.saveAndContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT show an error when OtherAccountablePerson exists', async(inject([Router], (router: any) => {
    spyOn(router, 'navigate')
    component.buildingRegistrationService.model.OtherAccountablePerson = '/'
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});
