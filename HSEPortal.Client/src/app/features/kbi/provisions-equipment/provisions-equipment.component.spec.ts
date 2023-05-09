import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsEquipmentComponent } from './provisions-equipment.component';

describe('ProvisionsEquipmentComponent', () => {
  let component: ProvisionsEquipmentComponent;
  let fixture: ComponentFixture<ProvisionsEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionsEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
