import { HttpClient } from "@angular/common/http";
import { DebugElement, Type } from "@angular/core";
import { ComponentFixture, inject, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ApplicationService } from "src/app/services/application.service";

export class TestHelper {
    protected applicationService!: ApplicationService;
    protected description!: string;
    protected testCase!: () => void;
    protected spyOn!: () => void;

    constructor() { }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setSpyOn(spyOn: () => void) {
        this.spyOn = spyOn  
        return this;
    }

    setTestCase(test: (applicationService: ApplicationService, value?: any) => void, ...values:any[]): this {  
        this.testCase = async () => {
            if(!!this.spyOn) this.spyOn();
            if(!values || values.length == 0) await test(this.applicationService);
            await values.forEach(async value => {                
                await test(this.applicationService, value);
            });
        };
        return this;
    }

    execute() {
        it(this.description, inject([ApplicationService], async (applicationService: ApplicationService) => {
            this.applicationService = applicationService;
            await this.testCase();
        }));
    }

    executeAndWaitForAsync() {
        it(this.description, waitForAsync(inject([ApplicationService], (applicationService: ApplicationService) => {
            this.applicationService = applicationService;
            this.testCase();
        })));
    }

    disabled() {
        xit(this.description);
    }
}

export function findComponent<T>(
    fixture: ComponentFixture<T>,
    directive: Type<any>,
  ): DebugElement {
    return fixture.debugElement.query(By.directive(directive));
  }
