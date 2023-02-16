import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationJobRoleApComponent } from './organisation-job-role-ap.component';

xdescribe('OrganisationJobRoleApComponent', () => {
  let component: OrganisationJobRoleApComponent;
  let fixture: ComponentFixture<OrganisationJobRoleApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationJobRoleApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationJobRoleApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
