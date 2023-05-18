import { NgModule } from "@angular/core";
import { PeopleLivingInSectionDescriptionPipe } from "./people-living-in-section-description.pipe";
import { YearOfCompletionOptionPipe } from "./year-of-completion-option.pipe";
import { YearOfCompletionPipe } from "./year-of-completion.pipe";
import { WhoAreYouDescriptionPipe } from './who-are-you-description.pipe';
import { UseSameAddressDescriptionPipe } from './use-same-address-description.pipe';
import { OrganisationTypeDescriptionPipe } from './organisation-type-description.pipe';
import { LeadJobRoleDescriptionPipe } from './lead-job-role-description.pipe';
import { AccountabilityDescriptionPipe } from './accountability-description.pipe';
import { ExternalWallMaterialsPipe } from './external-wall-materials.pipe';

@NgModule({
  declarations: [
    PeopleLivingInSectionDescriptionPipe,
    YearOfCompletionOptionPipe,
    YearOfCompletionPipe,
    WhoAreYouDescriptionPipe,
    UseSameAddressDescriptionPipe,
    OrganisationTypeDescriptionPipe,
    LeadJobRoleDescriptionPipe,
    AccountabilityDescriptionPipe,
    ExternalWallMaterialsPipe
  ],
  exports: [
    PeopleLivingInSectionDescriptionPipe,
    YearOfCompletionOptionPipe,
    YearOfCompletionPipe,
    WhoAreYouDescriptionPipe,
    UseSameAddressDescriptionPipe,
    OrganisationTypeDescriptionPipe,
    LeadJobRoleDescriptionPipe,
    AccountabilityDescriptionPipe,
    ExternalWallMaterialsPipe
  ]
})
export class PipesModule { }
