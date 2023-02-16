import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ApplicationStartComponent } from 'src/app/features/application/components/application-start/application-start.component';
import { ApplicationService } from 'src/app/services/application.service';

let component: ApplicationStartComponent;
let fixture: ComponentFixture<ApplicationStartComponent>;

describe('ApplicationStartComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationStartComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the continueLink is empty or undefined.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    [undefined, ''].forEach(link => {
      component.continueLink = link;
      component.continue();
      expect(component.showError).toBeTrue();
    });
  })));

  it('should NOT show an error when continueLink exists',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    component.continueLink = '/'
    component.continue();
    expect(component.showError).toBeFalse();
  })));

});
