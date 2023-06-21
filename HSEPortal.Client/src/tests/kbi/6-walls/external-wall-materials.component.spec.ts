import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';

import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalWallMaterialsComponent } from 'src/app/features/kbi/6-walls/external-wall-materials/external-wall-materials.component';

let component: ExternalWallMaterialsComponent;
let fixture: ComponentFixture<ExternalWallMaterialsComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('ExternalWallMaterialsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExternalWallMaterialsComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        
        
        fixture = TestBed.createComponent(ExternalWallMaterialsComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the ExternalWallMaterials is empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallMaterials = value;
            component.hasErrors = !component.canContinue();
            expect(component.externalWallMaterialsHasErrors).toBeTrue();            
        }, [], undefined).execute();

    new TestHelper()
        .setDescription('should NOT show an error when the ExternalWallMaterials is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallMaterials = value;
            component.hasErrors = !component.canContinue();
            expect(component.externalWallMaterialsHasErrors).toBeFalse();            
        }, ["acm", "hpl", "metal-composite-panels"], ["other-composite-panels"], ["concrete", "green-walls"], ["masonry", "render", "tiles", "timber"] ).execute();

});

