import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualNameApComponent } from './individual-name-ap.component';

describe('IndividualNameApComponent', () => {
  let component: IndividualNameApComponent;
  let fixture: ComponentFixture<IndividualNameApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualNameApComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualNameApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
