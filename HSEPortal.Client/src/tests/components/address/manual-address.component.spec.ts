import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestHelper } from 'src/tests/test-helper';

import { ManualAddressComponent } from 'src/app/components/address/manual-address.component';

let component: ManualAddressComponent;
let fixture: ComponentFixture<ManualAddressComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    fixture = TestBed.createComponent(ManualAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ManualAddressComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManualAddressComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        fixture = TestBed.createComponent(ManualAddressComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    let testCases: { postcode?: string, addressLine1?: string, town?: string }[] = [
        { postcode: "", addressLine1: "", town: "" },
        { postcode: undefined, addressLine1: undefined, town: undefined },
        { postcode: undefined, addressLine1: "", town: "" },
        { postcode: "", addressLine1: undefined, town: "" },
        { postcode: "", addressLine1: "", town: undefined },
        { postcode: undefined, addressLine1: "", town: undefined },
        { postcode: "", addressLine1: undefined, town: undefined },
        { postcode: undefined, addressLine1: undefined, town: "" },
    ];

    new TestHelper()
        .setDescription('Should show an error when the postcode, the town and the address are undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.model.Address = value.addressLine1;
            component.model.Town = value.town;
            component.model.Postcode = value.postcode;

            component.confirmAddress();

            expect(component.errors.postcode.hasErrors).toBeTrue();
            expect(component.errors.lineOneHasErrors).toBeTrue();
            expect(component.errors.townOrCityHasErrors).toBeTrue();
            expect(component.hasErrors).toBeTrue();
        }, ...testCases).execute();


    new TestHelper()
        .setDescription('Should show an error when the postcode is undefined or empty, but the town and address are valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.model.Address = "Valid address";
            component.model.Town = "Valid Town";
            component.model.Postcode = value;

            component.confirmAddress();

            expect(component.hasErrors).toBeTrue();
            expect(component.errors.postcode.hasErrors).toBeTrue();
            expect(component.errors.lineOneHasErrors).toBeFalse();
            expect(component.errors.townOrCityHasErrors).toBeFalse();
        }, "", undefined).execute();

    new TestHelper()
        .setDescription('Should show an error when the town is undefined or empty, but the postcode and address are valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.model.Address = "Valid address";
            component.model.Town = value;
            component.model.Postcode = "SW1A1AA";

            component.confirmAddress();

            expect(component.hasErrors).toBeTrue();
            expect(component.errors.postcode.hasErrors).toBeFalse();
            expect(component.errors.lineOneHasErrors).toBeFalse();
            expect(component.errors.townOrCityHasErrors).toBeTrue();
        }, "", undefined).execute();

    new TestHelper()
        .setDescription('Should show an error when the address is undefined or empty, but the postcode and town are valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.model.Address = value;
            component.model.Town = "Valid Town";
            component.model.Postcode = "SW1A1AA";

            component.confirmAddress();

            expect(component.hasErrors).toBeTrue();
            expect(component.errors.postcode.hasErrors).toBeFalse();
            expect(component.errors.lineOneHasErrors).toBeTrue();
            expect(component.errors.townOrCityHasErrors).toBeFalse();
        }, "", undefined).execute();

    new TestHelper()
        .setDescription('Should NOT show an error when the address, the postcode and town are valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.model.Address = "Valid address";
            component.model.Town = "Valid Town";
            component.model.Postcode = "SW1A1AA";

            component.confirmAddress();

            expect(component.hasErrors).toBeFalse();
            expect(component.errors.postcode.hasErrors).toBeFalse();
            expect(component.errors.lineOneHasErrors).toBeFalse();
            expect(component.errors.townOrCityHasErrors).toBeFalse();
        }, "", undefined).execute();

});