import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService, SectionAccountability, SectionModel } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { ApAccountableForComponent } from 'src/app/features/application/accountable-person/accountable-for/accountable-for.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let component: ApAccountableForComponent;
let fixture: ComponentFixture<ApAccountableForComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startNewAccountablePerson();
    applicationService.startAccountablePersonEdit();

    applicationService.startSectionsEdit();
    applicationService.model.Sections = [new SectionModel()];
    applicationService.currentAccountablePerson.Type = 'organisation';
    applicationService.currentAccountablePerson.OrganisationName = "OrganisationName";

    fixture = TestBed.createComponent(ApAccountableForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ApAccountableForComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApAccountableForComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
        setup(applicationService);
        
        expect(component).toBeTruthy();
    }));

    new TestHelper()
        .setDescription('should show an error when the SectionsAccountability is empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.SectionsAccountability = value
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, [{ SectionName: "accountability2", Accountability: [] }]).execute();

    let testCases: SectionAccountability[][] = [
        [{ SectionName: "accountability1", Accountability: ["maintenance", "routes", "facilities"] }],
        [{ SectionName: "accountability2", Accountability: ["routes",] },
        { SectionName: "accountability3", Accountability: ["routes", "facilities"] }],
    ]

    new TestHelper()
        .setDescription('should NOT show an error when the SectionsAccountability has one or more elements.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.SectionsAccountability = value
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, ...testCases).execute();
});