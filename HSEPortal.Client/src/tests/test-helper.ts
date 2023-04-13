import { inject } from "@angular/core/testing";
import { ApplicationService } from "src/app/services/application.service";

export enum TestEnds {
    Success, Errors, ErrorMessages, NotErrorMessages
}

export class TestHelper {
    private component!: any;
    private applicationService!: ApplicationService;
    private description?: string;
    private testEnd?: TestEnds;
    private testCase!: () => void;

    constructor() { }

    setComponent(component: any) {
        this.component = component;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setTestCase(test: (applicationService: ApplicationService, value?: any) => void, ...params: any[]) {
        this.testCase = () => {
            params.forEach(value => {
                test(this.applicationService, value);
                this.component.hasErrors = !this.component.canContinue();
                this.executeTestEnd();
            });
        };
        return this;
    }

    setTestEnd(testEnd: TestEnds) {
        this.testEnd = testEnd;
        return this;
    }

    execute() {
        it(this.description ?? "", inject([ApplicationService], (applicationService: ApplicationService) => {
            this.applicationService = applicationService;
            this.testCase();
        }));
    }

    private executeTestEnd() {
        switch (this.testEnd) {
            case TestEnds.Success:
                () => this.expectedToEndWithErrors(); return;
            case TestEnds.Errors:
                () => this.expectedToEndWithoutErrors(); return;
            case TestEnds.ErrorMessages:
                () => this.expectedToShowErrorMessages(); return;
            case TestEnds.NotErrorMessages:
                () => this.expectedToNotShowErrorMessages(); return;
        }
    }

    private expectedToEndWithErrors() {
        expect(this.component.hasErrors).toBeTrue();
    }

    private expectedToEndWithoutErrors() {
        expect(this.component.hasErrors).toBeFalse();
    }

    private expectedToShowErrorMessages() {
        expect(this.component.getErrorDescription(this.component.hasErrors, 'Error message')).toBeDefined();
        expect(this.component.getErrorDescription(this.component.hasErrors, 'Error message')).toEqual('Error message');
    }

    private expectedToNotShowErrorMessages() {
        expect(this.component.getErrorDescription(this.component.hasErrors, 'Error message')).toBeUndefined();
    }
}