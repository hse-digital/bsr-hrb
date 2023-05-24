import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsBelowGroundLevelComponent } from './floors-below-ground-level.component';

describe('FloorsBelowGroundLevelComponent', () => {
  let component: FloorsBelowGroundLevelComponent;
  let fixture: ComponentFixture<FloorsBelowGroundLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorsBelowGroundLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorsBelowGroundLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
