import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { SecurityCodeComponent } from 'src/app/features/application/components/security-code/security-code.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: SecurityCodeComponent;
let fixture: ComponentFixture<SecurityCodeComponent>;

xdescribe('SecurityCodeComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityCodeComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SecurityCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let testCasesShowError = [
    { description: 'should show an error when the security code is empty or undefined.', securityCode: ['', undefined] },
    { description: 'should show an error when the security code has letters.', securityCode: ['abcdef', '01234ab', 'a2c4e6'] },
    { description: 'should show an error when the security code does not have 6 digits.', securityCode: ['1', '1234', '4412345', '441234567890123456'] },
  ]

  testCasesShowError.forEach((test) => {
    it(test.description,  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
      spyOn(router, 'navigate');
      test.securityCode?.forEach((code) => {
        component.building.securityCode = code;
        component.saveAndContinue();
        expect(component.hasErrors).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })));
  });

  it('should NOT show an error when the security code is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    component.building.securityCode = '123456';
    component.saveAndContinue();
    expect(component.hasErrors).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  })));
});

xdescribe('SecurityCodeComponent getErrorDescription(value, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityCodeComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the error messages when the security code is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {

    let securityCode: any[] = [undefined, '', '123', '123456789', '1234567', '12345', 'abcdef', 'abc456', '123abc', '123abc']

    spyOn(router, 'navigate');
    securityCode?.forEach(code => {
      component.building.securityCode = code;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.errors.securityCode.hasError, 'Error message')).toBeDefined();
      expect(component.getErrorDescription(component.errors.securityCode.hasError, 'Error message')).toEqual('Error message');
      expect(router.navigate).not.toHaveBeenCalled();
    });

  })));

  it('should NOT show an error when the security code is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    ['123456', '012345', '987654'].forEach(code => {
      component.building.securityCode = code;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  })));

});
