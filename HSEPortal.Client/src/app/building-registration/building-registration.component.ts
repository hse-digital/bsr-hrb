import { Component } from "@angular/core";
import { HeaderTitleService } from "../services/headertitle.service";

@Component({
    template: '<router-outlet/>'
})
export class BuildingRegistrationComponent {
    constructor(private headerTitleService: HeaderTitleService) {
        console.log('test');
        this.headerTitleService.headerTitle = 'Register a high-rise building';
    }

}