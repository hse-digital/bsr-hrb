import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryUseBuildingBelowGroundLevelComponent } from './primary-use-building-below-ground-level.component';

describe('PrimaryUseBuildingBelowGroundLevelComponent', () => {
  let component: PrimaryUseBuildingBelowGroundLevelComponent;
  let fixture: ComponentFixture<PrimaryUseBuildingBelowGroundLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryUseBuildingBelowGroundLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryUseBuildingBelowGroundLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
