import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAllocatedAccountabilityAreasComponent } from './not-allocated-accountability-areas.component';

describe('NotAllocatedAccountabilityAreasComponent', () => {
  let component: NotAllocatedAccountabilityAreasComponent;
  let fixture: ComponentFixture<NotAllocatedAccountabilityAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotAllocatedAccountabilityAreasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotAllocatedAccountabilityAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
