import { NgModule } from "@angular/core";
import { PeopleLivingInSectionDescriptionPipe } from "./people-living-in-section-description.pipe";
import { YearOfCompletionOptionPipe } from "./year-of-completion-option.pipe";
import { YearOfCompletionPipe } from "./year-of-completion.pipe";

@NgModule({
    declarations: [
        PeopleLivingInSectionDescriptionPipe,
        YearOfCompletionOptionPipe,
        YearOfCompletionPipe
    ],
    exports: [
        PeopleLivingInSectionDescriptionPipe,
        YearOfCompletionOptionPipe,
        YearOfCompletionPipe
    ]
})
export class PipesModule {}