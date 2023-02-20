import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualContactDetailsApComponent } from 'src/app/features/application/accountable-person/individual/individual-contact-details-ap/individual-contact-details-ap.component';

xdescribe('ContactDetailsOtherApComponent', () => {
  let component: IndividualContactDetailsApComponent;
  let fixture: ComponentFixture<IndividualContactDetailsApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualContactDetailsApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualContactDetailsApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
