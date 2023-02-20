import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';

xdescribe('AddAccountablePersonComponent', () => {
  let component: AddAccountablePersonComponent;
  let fixture: ComponentFixture<AddAccountablePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccountablePersonComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccountablePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
