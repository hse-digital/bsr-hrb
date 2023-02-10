import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ApplicationCompletedComponent } from '../../app/features/application/components/application-completed/application-completed.component';
import { ApplicationService } from '../../app/services/application.service';

describe('ApplicationCompleteComponent', () => {
  let component: ApplicationCompletedComponent;
  let fixture: ComponentFixture<ApplicationCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationCompletedComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [HttpClient, HttpHandler, ApplicationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
