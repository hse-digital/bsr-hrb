import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacuationStrategyComponent } from './evacuation-strategy.component';

describe('EvacuationStrategyComponent', () => {
  let component: EvacuationStrategyComponent;
  let fixture: ComponentFixture<EvacuationStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvacuationStrategyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvacuationStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
