import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameAllBlocksComponent } from './name-all-blocks.component';

xdescribe('NameAllBlocksComponent', () => {
  let component: NameAllBlocksComponent;
  let fixture: ComponentFixture<NameAllBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameAllBlocksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameAllBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
