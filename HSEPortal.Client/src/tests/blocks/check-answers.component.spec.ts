import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { CheckAnswersComponent } from 'src/app/features/application/blocks/check-answers/check-answers.component';

xdescribe('CheckAnswersComponent', () => {
  let component: CheckAnswersComponent;
  let fixture: ComponentFixture<CheckAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckAnswersComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [Router, ApplicationService, HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
