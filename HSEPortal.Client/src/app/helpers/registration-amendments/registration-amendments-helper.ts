import { Change, ChangeCategory, ChangeRequest } from "src/app/services/registration-amendments.service";

export abstract class ChangesDirector {
    protected Category?: ChangeCategory;    
    protected Table?: string;
    protected ChangeName?: string;
    protected ChangeRequestName?: string;
    protected FieldName?: string
    protected OriginalAnswer?: string
    protected NewAnswer?: string
    protected ReviewRequired?: boolean

    protected ApplicationId?: string;
    protected BuildingName?: string;

    SetApplicationId(applicationId: string) {
        this.ApplicationId = applicationId;
        return this;
    }

    SetBuildingName(buildingName: string) {
        this.BuildingName = buildingName;
        return this;
    }

    private SetChangeName() {
        return `${this.ApplicationId}:${this.BuildingName} - ${this.ChangeCategoryMapper[this.Category!]}`;
    }

    private SetChangeRequestName() {
        return `${this.ApplicationId}:${this.BuildingName} - ${this.ChangeCategoryMapper[this.Category!]}`;
    }

    SetField(name: string) {
        this.FieldName = name;
        return this;
    }

    Change(OriginalAnswer: string, NewAnswer: string) {
        this.OriginalAnswer = OriginalAnswer;
        this.NewAnswer = NewAnswer;
        return this;
    }

    CreateChange(): Change {
        this.ChangeName = this.SetChangeName();
        return {
            Name: this.ChangeName,
            Table: this.Table,
            FieldName: this.FieldName,
            OriginalAnswer: this.OriginalAnswer,
            NewAnswer: this.NewAnswer,
            CreatedOn: Date.now(),
        };
    }

    CreateChangeRequest(): ChangeRequest {
        this.ChangeRequestName = this.SetChangeRequestName();
        return {
            Name: this.ChangeRequestName,
            Category: this.Category,
            ReviewRequired: this.ReviewRequired,
            CreatedOn: Date.now(),
        };
    }

    private ChangeCategoryMapper : Record<ChangeCategory, string> = {
        [ChangeCategory.ApplicationBuildingAmendments]: "Application/Building Amendments",
        [ChangeCategory.ChangeApplicantUser]: "Change Applicant/User",
        [ChangeCategory.DeRegistration]: "De-registration"
    }
}

export class ChangeApplicantModelBuilder extends ChangesDirector {
    protected override Category: ChangeCategory = ChangeCategory.ApplicationBuildingAmendments;
    protected override Table: string = "Building Application";
    protected override ReviewRequired: boolean = false;
}