import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { OtherAccountablePersonComponent } from 'src/app/features/application/accountable-person/other-accountable-person/other-accountable-person.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: OtherAccountablePersonComponent;
let fixture: ComponentFixture<OtherAccountablePersonComponent>;

describe('OtherAccountablePersonComponent showError', () => {

  beforeEach( async() => {
    await TestBed.configureTestingModule({
      declarations: [OtherAccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherAccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the OtherAccountablePerson is empty or undefined.', async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    [undefined, ''].forEach(type => {
      applicationService.newApplication();
      applicationService.currentAccountablePerson.Type = type;
      component.saveAndContinue();
      expect(component.hasErrors).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  })));

  it('should NOT show an error when OtherAccountablePerson exists', async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate')
    applicationService.newApplication();
    applicationService.currentAccountablePerson.Type = 'organisation';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});

describe('OtherAccountablePersonComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [OtherAccountablePersonComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    }).compileComponents();

    
    fixture = TestBed.createComponent(OtherAccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the OtherAccountablePerson is undefined.', async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentAccountablePerson.Type = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.otherAccountablePersonHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.otherAccountablePersonHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the OtherAccountablePerson is valid.', async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.currentAccountablePerson.Type = 'individual';
    component.saveAndContinue();
    expect(component.getErrorDescription(component.otherAccountablePersonHasErrors, 'Error message')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalled();
  })));

});
