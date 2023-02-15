import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAddressComponent } from 'src/app/features/application/accountable-person/organisation/organisation-address/organisation-address.component';

describe('OrganisationAddressComponent', () => {
  let component: OrganisationAddressComponent;
  let fixture: ComponentFixture<OrganisationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
