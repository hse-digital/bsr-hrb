import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexStructureComponent } from './complex-structure.component';

xdescribe('ComplexStructureComponent', () => {
  let component: ComplexStructureComponent;
  let fixture: ComponentFixture<ComplexStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
