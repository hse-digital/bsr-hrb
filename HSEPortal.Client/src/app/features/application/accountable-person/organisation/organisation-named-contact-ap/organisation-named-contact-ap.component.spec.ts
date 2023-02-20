import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationNamedContactApComponent } from './organisation-named-contact-ap.component';

xdescribe('OrganisationNamedContactApComponent', () => {
  let component: OrganisationNamedContactApComponent;
  let fixture: ComponentFixture<OrganisationNamedContactApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationNamedContactApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationNamedContactApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
