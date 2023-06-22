import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { ChangePrimaryUseComponent } from 'src/app/features/kbi/7-building-use/change-primary-use/change-primary-use.component';

let component: ChangePrimaryUseComponent;
let fixture: ComponentFixture<ChangePrimaryUseComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('ChangePrimaryUseComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangePrimaryUseComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(ChangePrimaryUseComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the ChangePrimaryUse is empty.', strategy: '' },
        { description: 'should show an error when the ChangePrimaryUse is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.ChangePrimaryUse = value;
                component.hasErrors = !component.canContinue();

                expect(component.changePrimaryUseHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the ChangePrimaryUse is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.ChangePrimaryUse = value;
            component.hasErrors = !component.canContinue();
            expect(component.changePrimaryUseHasErrors).toBeFalse();

        }, "yes", "no").execute();

});

