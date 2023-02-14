import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationNameApComponent } from './organisation-name-ap.component';

describe('OrganisationNameApComponent', () => {
  let component: OrganisationNameApComponent;
  let fixture: ComponentFixture<OrganisationNameApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationNameApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationNameApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
