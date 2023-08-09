import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyRegisteredMultiComponent } from './already-registered-multi.component';

describe('AlreadyRegisteredMultiComponent', () => {
  let component: AlreadyRegisteredMultiComponent;
  let fixture: ComponentFixture<AlreadyRegisteredMultiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyRegisteredMultiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyRegisteredMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
