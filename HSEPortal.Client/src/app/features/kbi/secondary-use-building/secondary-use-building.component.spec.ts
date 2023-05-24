import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryUseBuildingComponent } from './secondary-use-building.component';

describe('SecondaryUseBuildingComponent', () => {
  let component: SecondaryUseBuildingComponent;
  let fixture: ComponentFixture<SecondaryUseBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryUseBuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryUseBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
