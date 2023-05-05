import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { SelectAddressComponent } from 'src/app/components/address/select-address.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddressModel } from 'src/app/services/address.service';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';

let component: SelectAddressComponent;
let fixture: ComponentFixture<SelectAddressComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    fixture = TestBed.createComponent(SelectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('SelectAddressComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectAddressComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();
    });

    it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
        setup(applicationService);
        expect(component).toBeTruthy();
    }));

    new TestHelper()
        .setDescription('should show an error when the selectedAddress is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.selectedAddress = value;
            component.continue();
            expect(component.addressHasErrors).toBeTrue();
        }, undefined, '').execute();

    new TestHelper()
        .setDescription('should NOT show an error when the value of selectedAddress is valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            let addressModel: AddressModel = { IsManual: true, Address: "Valid address" };
            component.selectedAddress = addressModel;
            component.continue();
            expect(component.addressHasErrors).toBeFalse();
        }).execute();

});