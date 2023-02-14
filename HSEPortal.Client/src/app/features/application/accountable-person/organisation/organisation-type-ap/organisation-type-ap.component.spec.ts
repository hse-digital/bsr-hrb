import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationTypeApComponent } from './organisation-type-ap.component';

describe('OrganisationTypeApComponent', () => {
  let component: OrganisationTypeApComponent;
  let fixture: ComponentFixture<OrganisationTypeApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationTypeApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationTypeApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
