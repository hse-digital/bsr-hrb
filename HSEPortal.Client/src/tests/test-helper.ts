import { inject } from "@angular/core/testing";
import { ApplicationService } from "src/app/services/application.service";

export enum TestEnds {
    Success, Errors, ErrorMessages, NotErrorMessages
}

export class TestHelper {
    private applicationService!: ApplicationService;
    private description!: string;
    private testCase!: () => void;

    constructor() { }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setTestCase(test: (applicationService: ApplicationService, value?: any) => void, ...values: any[]) {
        this.testCase = () => {
            values.forEach(value => {
                test(this.applicationService, value);
            });
        };
        return this;
    }

    execute() {
        it(this.description, inject([ApplicationService], (applicationService: ApplicationService) => {
            this.applicationService = applicationService;
            this.testCase();
        }));
    }
}