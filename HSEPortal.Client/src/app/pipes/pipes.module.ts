import { NgModule } from "@angular/core";
import { PeopleLivingInSectionDescriptionPipe } from "./people-living-in-section-description.pipe";

@NgModule({
    declarations: [
        PeopleLivingInSectionDescriptionPipe
    ],
    exports: [
        PeopleLivingInSectionDescriptionPipe
    ]
})
export class PipesModule {}