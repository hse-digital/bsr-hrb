import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCheckAnswersApComponent } from './individual-check-answers-ap.component';

describe('IndividualCheckAnswersApComponent', () => {
  let component: IndividualCheckAnswersApComponent;
  let fixture: ComponentFixture<IndividualCheckAnswersApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCheckAnswersApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualCheckAnswersApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
