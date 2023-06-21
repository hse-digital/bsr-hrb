import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { WallsAcmComponent } from 'src/app/features/kbi/6-walls/walls-acm/walls-acm.component';

let component: WallsAcmComponent;
let fixture: ComponentFixture<WallsAcmComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('WallsAcmComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WallsAcmComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(WallsAcmComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the WallACM is empty.', strategy: '' },
        { description: 'should show an error when the WallACM is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.Walls.WallACM = value;
                component.hasErrors = !component.canContinue();

                expect(component.wallsAcmHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the WallACM is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.WallACM = value;
            component.hasErrors = !component.canContinue();
            expect(component.wallsAcmHasErrors).toBeFalse();

        }, "fire-classification", "large-scale-fire-test", "neither-these" ).execute();

});
