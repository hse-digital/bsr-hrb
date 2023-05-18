import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedPercentageComponent } from './estimated-percentage.component';

describe('EstimatedPercentageComponent', () => {
  let component: EstimatedPercentageComponent;
  let fixture: ComponentFixture<EstimatedPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatedPercentageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimatedPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
