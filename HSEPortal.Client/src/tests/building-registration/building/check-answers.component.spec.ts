import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { CheckAnswersComponent } from '../../../app/features/application/components/building/check-answers/check-answers.component';

import { BlockRegistrationService } from '../../../app/services/block-registration.service';

describe('CheckAnswersComponent', () => {
  let component: CheckAnswersComponent;
  let fixture: ComponentFixture<CheckAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckAnswersComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [Router, BlockRegistrationService, HttpClient, HttpHandler]
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
