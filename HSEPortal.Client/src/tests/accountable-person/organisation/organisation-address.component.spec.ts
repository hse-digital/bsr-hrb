import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApAddressComponent } from 'src/app/features/application/accountable-person/ap-address/ap-address.component';
import { PapAddressComponent } from 'src/app/features/application/accountable-person/ap-address/pap-address.component';

import { ApplicationService } from 'src/app/services/application.service';

describe('PapAddressComponent', () => {
  let component: PapAddressComponent;
  let fixture: ComponentFixture<PapAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PapAddressComponent, ApAddressComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService]
    }).compileComponents();

  });

  it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
    applicationService.newApplication();
    applicationService.startNewAccountablePerson();
    applicationService.startAccountablePersonEdit();
    
    fixture = TestBed.createComponent(PapAddressComponent);
    component = fixture.componentInstance;
    applicationService.currentAccountablePerson.PapAddress = { IsManual: false, Address: "Address line", Postcode: "SW1A 1AA" }
    fixture.detectChanges();

    expect(component).toBeTruthy();
  }));
});
