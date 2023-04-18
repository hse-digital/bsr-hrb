import { HttpClient } from "@angular/common/http";
import { DebugElement, Type } from "@angular/core";
import { ComponentFixture, inject } from "@angular/core/testing";
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
        this.testCase = () => {
            if(!!this.spyOn) this.spyOn();
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

export class TestHelperHttpClient extends TestHelper {

    private httpClient!: HttpClient;
    
    override setTestCase(test: (applicationService: ApplicationService, httpClient: HttpClient, value?: any) => void, ...values:any[]): this {  
        this.testCase = () => {
            values.forEach(value => {                
                test(this.applicationService, this.httpClient, value);
            });
        };
        return this;
    }

    override execute() {
        it(this.description, inject([ApplicationService, HttpClient], (applicationService: ApplicationService, httpClient: HttpClient) => {
            this.applicationService = applicationService;
            this.httpClient = httpClient;
            this.testCase();
        }));
    }
}

export function findComponent<T>(
    fixture: ComponentFixture<T>,
    directive: Type<any>,
  ): DebugElement {
    return fixture.debugElement.query(By.directive(directive));
  }
