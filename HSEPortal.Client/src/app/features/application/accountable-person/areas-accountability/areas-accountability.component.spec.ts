import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasAccountabilityComponent } from './areas-accountability.component';

describe('AreasAccountabilityComponent', () => {
  let component: AreasAccountabilityComponent;
  let fixture: ComponentFixture<AreasAccountabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreasAccountabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasAccountabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
