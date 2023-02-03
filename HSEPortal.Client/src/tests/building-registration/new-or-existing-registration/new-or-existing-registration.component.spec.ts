import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { NewOrExistingRegistrationComponent } from '../../../app/building-registration/new-or-existing-registration/new-or-existing-registration.component';
import { BuildingRegistrationService } from '../../../app/services/building-registration/building-registration.service';

let component: NewOrExistingRegistrationComponent;
let fixture: ComponentFixture<NewOrExistingRegistrationComponent>;

describe('NewOrExistingRegistrationComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewOrExistingRegistrationComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [BuildingRegistrationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(NewOrExistingRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the continueLink is empty or undefined.', async(inject([Router], (router: any) => {
    [undefined, ''].forEach(link => {
      component.continueLink = link;
      component.updateErrorStatus();
      expect(component.showError).toBeTrue();
    });
  })));

  it('should NOT show an error when continueLink exists', async(inject([Router], (router: any) => {
    component.continueLink = '/'
    component.updateErrorStatus();
    expect(component.showError).toBeFalse();
  })));

});
