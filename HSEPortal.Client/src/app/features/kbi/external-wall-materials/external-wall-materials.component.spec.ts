import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalWallMaterialsComponent } from './external-wall-materials.component';

describe('ExternalWallMaterialsComponent', () => {
  let component: ExternalWallMaterialsComponent;
  let fixture: ComponentFixture<ExternalWallMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalWallMaterialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalWallMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
