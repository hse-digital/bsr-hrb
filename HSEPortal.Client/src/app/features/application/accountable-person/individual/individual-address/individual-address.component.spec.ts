import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAddressComponent } from './individual-address.component';

describe('IndividualAddressComponent', () => {
  let component: IndividualAddressComponent;
  let fixture: ComponentFixture<IndividualAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
