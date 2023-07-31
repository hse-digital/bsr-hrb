import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyRegisteredSingleComponent } from './already-registered-single.component';

describe('AlreadyRegisteredSingleComponent', () => {
  let component: AlreadyRegisteredSingleComponent;
  let fixture: ComponentFixture<AlreadyRegisteredSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyRegisteredSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyRegisteredSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
