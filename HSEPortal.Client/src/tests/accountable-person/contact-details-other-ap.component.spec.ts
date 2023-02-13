import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsOtherApComponent } from '../../app/features/application/accountable-person/contact-details-other-ap/contact-details-other-ap.component';

describe('ContactDetailsOtherApComponent', () => {
  let component: ContactDetailsOtherApComponent;
  let fixture: ComponentFixture<ContactDetailsOtherApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactDetailsOtherApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDetailsOtherApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
