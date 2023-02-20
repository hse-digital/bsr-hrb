import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAddressComponent } from './section-address.component';

xdescribe('AddressComponent', () => {
  let component: SectionAddressComponent;
  let fixture: ComponentFixture<SectionAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
