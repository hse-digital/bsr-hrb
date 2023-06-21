import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalFeaturesComponent } from 'src/app/features/kbi/6-walls/external-features/external-features.component';

let component: ExternalFeaturesComponent;
let fixture: ComponentFixture<ExternalFeaturesComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('ExternalFeaturesComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExternalFeaturesComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        
        
        fixture = TestBed.createComponent(ExternalFeaturesComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string[] }[] = [
        { description: 'should show an error when the ExternalFeatures is empty.', strategy: [] },
        { description: 'should show an error when the ExternalFeatures is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Walls.ExternalFeatures = value;
                component.hasErrors = !component.canContinue();

                expect(component.externalFeaturesHasErrors).toBeTrue();

            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the ExternalFeatures is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalFeatures = value;
            component.hasErrors = !component.canContinue();
            expect(component.externalFeaturesHasErrors).toBeFalse();
            
        }, ["advertising", "balconies", "communal_recreation_area"], ["solar_shading"], ["phone_masts", "roof_lights"] ).execute();

});