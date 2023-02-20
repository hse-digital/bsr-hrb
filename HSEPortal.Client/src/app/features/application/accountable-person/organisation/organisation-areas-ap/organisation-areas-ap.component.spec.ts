import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAreasApComponent } from './organisation-areas-ap.component';

xdescribe('OrganisationAreasApComponent', () => {
  let component: OrganisationAreasApComponent;
  let fixture: ComponentFixture<OrganisationAreasApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAreasApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationAreasApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
