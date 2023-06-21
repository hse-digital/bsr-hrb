import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { WallsHplComponent } from 'src/app/features/kbi/6-walls/walls-hpl/walls-hpl.component';

let component: WallsHplComponent;
let fixture: ComponentFixture<WallsHplComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('WallsHplComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WallsHplComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(WallsHplComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the WallHPL is empty.', strategy: '' },
        { description: 'should show an error when the WallHPL is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.Walls.WallHPL = value;
                component.hasErrors = !component.canContinue();

                expect(component.wallsHplHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the WallHPL is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.WallHPL = value;
            component.hasErrors = !component.canContinue();
            expect(component.wallsHplHasErrors).toBeFalse();

        }, "fire-classification", "large-scale-fire-test", "neither-these" ).execute();

});
