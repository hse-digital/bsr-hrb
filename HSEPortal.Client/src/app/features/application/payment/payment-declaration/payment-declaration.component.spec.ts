import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDeclarationComponent } from './payment-declaration.component';

describe('PaymentDeclarationComponent', () => {
  let component: PaymentDeclarationComponent;
  let fixture: ComponentFixture<PaymentDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDeclarationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
