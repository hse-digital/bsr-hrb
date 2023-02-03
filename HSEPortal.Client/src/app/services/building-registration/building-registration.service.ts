import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BuildingRegistrationService {
    buildingRegistrationModel: BuildingRegistrationModel = {};

    constructor(private httpClient: HttpClient) { }

    setBuildingName(buildingName: string) {
        this.buildingRegistrationModel.BuildingName = buildingName;
    }

    setContactFirstName(contactFirstName: string) {
        this.buildingRegistrationModel.ContactFirstName = contactFirstName;
    }

    setContactLastName(contactLastName: string) {
        this.buildingRegistrationModel.ContactLastName = contactLastName;
    }

    setContactPhoneNumber(contactPhoneNumber: string) {
        this.buildingRegistrationModel.ContactPhoneNumber = contactPhoneNumber;
    }

    setContactEmailAddress(contactEmailAddress: string) {
        this.buildingRegistrationModel.ContactEmailAddress = contactEmailAddress;
    }

    async registerNewBuildingApplication(): Promise<void> {
        await firstValueFrom(this.httpClient.post('api/NewBuildingApplication', this.buildingRegistrationModel));
    }
}

class BuildingRegistrationModel {
    BuildingName?: string;
    ContactFirstName?: string;
    ContactLastName?: string;
    ContactPhoneNumber?: string;
    ContactEmailAddress?: string;
}
