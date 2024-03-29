import { Change, ChangeCategory, ChangeRequest } from "src/app/services/registration-amendments.service";

export abstract class ChangesDirector {
    protected Category?: ChangeCategory;    
    protected Table?: string;
    protected FieldName?: string;
    protected OriginalAnswer?: string;
    protected NewAnswer?: string;
    protected ReviewRequired?: boolean;
    protected Declaration?: boolean;

    protected ApplicationId?: string;
    protected BuildingName?: string;
    protected StructureName?: string;
    protected StructurePostcode?: string;

    SetApplicationId(applicationId: string) {
        this.ApplicationId = applicationId;
        return this;
    }

    SetBuildingName(buildingName: string) {
        this.BuildingName = buildingName;
        return this;
    }

    SetStructure(name: string, postcode: string) {
        this.StructureName = name;
        this.StructurePostcode = postcode;
        return this;
    }

    resetStructure() {
        this.StructureName = undefined;
        this.StructurePostcode = undefined;
        return this;
    }

    SetField(name: string) {
        this.FieldName = name;
        return this;
    }

    Change(OriginalAnswer: any, NewAnswer: any) {
        this.OriginalAnswer = OriginalAnswer != null && typeof OriginalAnswer == "object" ? this.arrayToString(OriginalAnswer) : OriginalAnswer;
        this.NewAnswer = NewAnswer != null && typeof NewAnswer == "object" ? this.arrayToString(NewAnswer) : NewAnswer;
        return this;
    }

    CreateChange(): Change {
        return {
            Table: this.Table,
            FieldName: this.FieldName,
            OriginalAnswer: this.OriginalAnswer,
            NewAnswer: this.NewAnswer
        };
    }

    CreateChangeRequest(): ChangeRequest {
        return {
            Category: this.Category,
            ReviewRequired: this.ReviewRequired,
            Declaration: this.Declaration,
            StructureName: this.StructureName,
            StructurePostcode: this.StructurePostcode,
            Change: []
        };
    }

    private arrayToString(array: any[]) {
        return array.join(', ');
    }
}

export class ChangeApplicantModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.ChangeApplicantUser;
    protected override Table: string = "Building Application";
    protected override ReviewRequired: boolean = false;
    protected override Declaration: boolean = true;
}

export class ChangeBuildingSummaryModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.ApplicationBuildingAmendments;
    protected override Table: string = "Structure";
    protected override ReviewRequired: boolean = true;
    protected override Declaration: boolean = true;
}

export class RemovedBuildingModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.DeRegistration;
    protected override Table: string = "Structure";
    protected override ReviewRequired: boolean = true;
    protected override Declaration: boolean = true;
}

export class DeregisterBuildingApplicationModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.DeRegistration;
    protected override Table: string = "Application";
    protected override ReviewRequired: boolean = true;
    protected override Declaration: boolean = true;
}

export class ChangeAccountablePersonModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.ChangePAPOrLeadContact;
    protected override Table: string = "Accountable person";
    protected override ReviewRequired: boolean = true;
    protected override Declaration: boolean = true;
}