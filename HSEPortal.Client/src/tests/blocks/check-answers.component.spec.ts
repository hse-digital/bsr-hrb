import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SectionCheckAnswersComponent } from 'src/app/features/application/building-summary/check-answers/check-answers.component';

import { ApplicationService } from 'src/app/services/application.service';

xdescribe('CheckAnswersComponent', () => {
  let component: SectionCheckAnswersComponent;
  let fixture: ComponentFixture<SectionCheckAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionCheckAnswersComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [Router, ApplicationService, HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionCheckAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
