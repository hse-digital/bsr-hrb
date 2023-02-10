import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ApplicationStartComponent } from '../../../app/features/application/components/application-start/application-start.component';
import { ApplicationService } from '../../../app/services/application.service';

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

  it('should show an error when the continueLink is empty or undefined.', async(inject([Router], (router: any) => {
    [undefined, ''].forEach(link => {
      component.continueLink = link;
      component.updateErrorStatus();
      expect(component.showError).toBeTrue();
    });
  })));

  it('should NOT show an error when continueLink exists', async(inject([Router], (router: any) => {
    component.continueLink = '/'
    component.updateErrorStatus();
    expect(component.showError).toBeFalse();
  })));

});
