import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { AnotherBlockComponent } from 'src/app/features/application/blocks/another-block/another-block.component';
import { ApplicationService } from 'src/app/services/application.service';

import { CaptionService } from 'src/app/services/caption.service';

let component: AnotherBlockComponent;
let fixture: ComponentFixture<AnotherBlockComponent>;


xdescribe('AnotherBlockComponent showError', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnotherBlockComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(AnotherBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when the anotherBlock is empty.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.model.Blocks = [{ Name: 'name1' }, { Name: 'name2' }, { Name: 'name3' }]
    applicationService.currentBlock.AnotherBlock = undefined;
    component.saveAndContinue();
    expect(component.hasErrors).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT show an error when the value of anotherBlock is "yes" or "no"',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let anotherBlock: string[] = ["yes", "no"]
    spyOn(router, 'navigate');
    anotherBlock.forEach(anotherBlock => {
      applicationService.newApplication();
      applicationService.model.Blocks = [{ Name: 'name1' }, { Name: 'name2' }, { Name: 'name3' }]
      applicationService.currentBlock.AnotherBlock = anotherBlock;
      component.saveAndContinue();
      expect(component.hasErrors).toBeFalse();
      setTimeout(() => expect(router.navigate).toHaveBeenCalled(), 100);
    });
  })));

});

xdescribe('AnotherBlockComponent getErrorDescription(hasError, errorText)', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnotherBlockComponent],
      imports: [RouterTestingModule, HseAngularModule],
      providers: [CaptionService, ApplicationService, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(AnotherBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display an error message when the anotherBlock is not valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    spyOn(router, 'navigate');
    applicationService.newApplication();
    applicationService.model.Blocks = [{ Name: 'name1' }, { Name: 'name2' }, { Name: 'name3' }]
    applicationService.currentBlock.AnotherBlock = undefined;
    component.saveAndContinue();
    expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toBeDefined();
    expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toEqual('Error message');
    expect(router.navigate).not.toHaveBeenCalled();
  })));

  it('should NOT display an error message when the anotherBlock is valid.',  async(inject([Router, ApplicationService], (router: any, applicationService: ApplicationService) => {
    let anotherBlock: string[] = ["yes", "no"]
    spyOn(router, 'navigate');
    anotherBlock.forEach(anotherBlock => {
      applicationService.newApplication();
      applicationService.model.Blocks = [{ Name: 'name1' }, { Name: 'name2' }, { Name: 'name3' }]
      applicationService.currentBlock.AnotherBlock = anotherBlock;
      component.saveAndContinue();
      expect(component.getErrorDescription(component.anotherBlockHasErrors, 'Error message')).toBeUndefined();
      setTimeout(() => expect(router.navigate).toHaveBeenCalled(), 100)
    });
  })));

});
