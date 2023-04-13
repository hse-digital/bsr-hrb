import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent } from 'src/app/components/address/address.component';



xdescribe('OrganisationAddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressComponent ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
