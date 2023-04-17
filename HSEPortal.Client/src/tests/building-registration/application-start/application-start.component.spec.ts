import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationSelectorComponent } from 'src/app/features/application-selector/application-selector.component';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';

let component: ApplicationSelectorComponent;
let fixture: ComponentFixture<ApplicationSelectorComponent>;

describe('ApplicationSelectorComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationSelectorComponent],
      imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
      providers: [ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  new TestHelper()
    .setDescription('should show an error when the continueLink is empty or undefined.')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      component.continueLink = value;
      component.continue();
      expect(component.showError).toBeTrue();
    }, undefined, '').execute();

  new TestHelper()
    .setDescription('should NOT show an error when continueLink exists')
    .setTestCase((applicationService: ApplicationService, value: any) => {
      component.continueLink = value;
      component.continue();
      expect(component.showError).toBeFalse();
    }, '/').execute();

});
