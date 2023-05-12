import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentialUnitFrontDoorsFireResistanceComponent } from './residential-unit-front-doors-fire-resistance.component';

describe('ResidentialUnitFrontDoorsFireResistanceComponent', () => {
  let component: ResidentialUnitFrontDoorsFireResistanceComponent;
  let fixture: ComponentFixture<ResidentialUnitFrontDoorsFireResistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentialUnitFrontDoorsFireResistanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentialUnitFrontDoorsFireResistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
