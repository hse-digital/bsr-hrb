import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from 'src/app/features/kbi/1-fire/residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';


import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: ResidentialUnitFrontDoorsFireResistanceComponent;
let fixture: ComponentFixture<ResidentialUnitFrontDoorsFireResistanceComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(ResidentialUnitFrontDoorsFireResistanceComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = { ResidentialUnitFrontDoors: {} };
    applicationService.model.Kbi!.KbiSections[0].Fire.ResidentialUnitFrontDoors = {};
    applicationService._currentKbiSectionIndex = 0;

    fixture.detectChanges();
}

describe('ResidentialUnitFrontDoorsFireResistanceComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResidentialUnitFrontDoorsFireResistanceComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    let testCasesShowError: { description: string, values: any[] }[] = [
        { description: 'should show an error when the ResidentialUnitFrontDoors are undefined or empty.', values: [undefined, ""] },
        { description: 'should show an error when the ResidentialUnitFrontDoors are a negative number.', values: [-1, -100] },
        { description: 'should show an error when the ResidentialUnitFrontDoors are a decimal number.', values: [1.2, 5.2] },
    ]

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.NoFireResistance  = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.HundredTwentyMinsFireResistance  = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.NotKnownFireResistance = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.SixtyMinsFireResistance = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.ThirtyMinsFireResistance = value;
                component.hasErrors = !component.canContinue();
                expect(component.hasErrors).toBeTrue();
            }, ...test.values).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when ResidentialUnitFrontDoors are valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.NoFireResistance  = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.HundredTwentyMinsFireResistance  = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.NotKnownFireResistance = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.SixtyMinsFireResistance = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ResidentialUnitFrontDoors!.ThirtyMinsFireResistance = value + randomOffset();
            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, 1, 3, 10, 88, 99, 500, 897).execute();

        function randomOffset() {
            return Math.floor(Math.random() * 100);;
        }
});