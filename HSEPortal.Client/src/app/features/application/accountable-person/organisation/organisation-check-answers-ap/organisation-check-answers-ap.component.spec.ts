import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCheckAnswersApComponent } from './organisation-check-answers-ap.component';

xdescribe('OrganisationCheckAnswersApComponent', () => {
  let component: OrganisationCheckAnswersApComponent;
  let fixture: ComponentFixture<OrganisationCheckAnswersApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationCheckAnswersApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationCheckAnswersApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
