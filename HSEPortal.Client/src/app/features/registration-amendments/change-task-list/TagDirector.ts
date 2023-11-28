import { TaskListSteps, TagStatus } from "./change-task-list.component";
import { ApplicationService, SectionModel, Status } from "src/app/services/application.service";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";

export class TagDirector {
    private Tag?: ChangeTaskListTag;

    constructor(protected applicationService: ApplicationService) { }

    setStep(step: TaskListSteps, index?: number): this {
        switch (step) {
            case TaskListSteps.BuildingSummary:
                this.Tag = new BuildingSummaryTag(this.applicationService); break;
            case TaskListSteps.AccountablePerson:
                this.Tag = new AccountablePersonTag(this.applicationService); break;
            case TaskListSteps.Kbi:
                this.Tag = new KbiTag(this.applicationService);
                (this.Tag as KbiTag).setIndex(index ?? 0); break;
            case TaskListSteps.Connections:
                this.Tag = new ConnectionsTag(this.applicationService); break;
            case TaskListSteps.Changes:
                this.Tag = new ChangesTag(this.applicationService); break;
            case TaskListSteps.Submit:
                this.Tag = new SubmitTag(this.applicationService); break;
        }
        return this;
    }

    getTag() {
        if (!this.Tag) return TagStatus.NotYetAvailable;
        return this.Tag.getTag();
    }
}

export abstract class ChangeTaskListTag {
    constructor(protected applicationService: ApplicationService) { }

    abstract getTag(index?: number): TagStatus;

    protected ContainsFlag(status: Status, flag: Status): boolean {
        return (status & flag) == flag;
    }
}

export class BuildingSummaryTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        if (this.applicationService.currentVersion.BuildingStatus == Status.ChangesInProgress) {
            return TagStatus.MoreInformationNeeded;
        } else if (this.applicationService.currentVersion.BuildingStatus == Status.ChangesComplete || this.areThereAnySectionsRemoved(this.applicationService.currentVersion.Sections)) {
            return TagStatus.ChangesNotYetSubmitted;
        }
        return TagStatus.NoChangesMade;
    }

    areThereAnySectionsRemoved(changeModel: SectionModel[] ) {
        return new ChangeBuildingSummaryHelper(this.applicationService).getRemovedStructures().length > 0;
    }
}

export class AccountablePersonTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        return TagStatus.NoChangesMade;
    }
}

export class KbiTag extends ChangeTaskListTag {
    private index?: number;

    setIndex(index: number): void {
        this.index = index;
    }

    getTag(): TagStatus {
        return TagStatus.NotYetAvailable;
    }
}

export class ConnectionsTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        return TagStatus.NotYetAvailable;
    }
}

export class ChangesTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        let manageAccess = this.applicationService.model?.RegistrationAmendmentsModel?.ChangeUser;
        
        if (!manageAccess) return TagStatus.NoChangesMade;

        let primaryUserStatus = manageAccess?.PrimaryUser?.Status ?? Status.NoChanges;
        let newSecondaryUserStatus = manageAccess?.NewSecondaryUser?.Status ?? Status.NoChanges;
        let secondaryUserStatus = manageAccess?.SecondaryUser?.Status ?? Status.NoChanges;

        if (this.ContainsFlag(primaryUserStatus, Status.ChangesSubmitted) && this.ContainsFlag(newSecondaryUserStatus, Status.ChangesSubmitted)) {
            return TagStatus.NoChangesMade;
        } else if (this.ContainsFlag(primaryUserStatus, Status.ChangesInProgress) || this.ContainsFlag(newSecondaryUserStatus, Status.ChangesInProgress)) {
            return TagStatus.MoreInformationNeeded;
        } else if (this.ContainsFlag(primaryUserStatus, Status.ChangesComplete) || this.ContainsFlag(newSecondaryUserStatus, Status.ChangesComplete) || this.ContainsFlag(secondaryUserStatus, Status.Removed)) {
            return TagStatus.ChangesNotYetSubmitted;
        } else if (this.ContainsFlag(primaryUserStatus, Status.NoChanges) && this.ContainsFlag(newSecondaryUserStatus, Status.NoChanges) ) {
            return TagStatus.NoChangesMade;
        }

        return TagStatus.NoChangesMade;
    }
}

export class SubmitTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        let changeUserTagStatus = new ChangesTag(this.applicationService).getTag();
        let changeBuildingSummaryTagStatus = new BuildingSummaryTag(this.applicationService).getTag();
 
        let canSubmit = !this.areAllNoChangesMade([changeUserTagStatus, changeBuildingSummaryTagStatus]) && this.isNotSubmittedOrNoChangesMade(changeUserTagStatus) && this.isNotSubmittedOrNoChangesMade(changeBuildingSummaryTagStatus);
        if(canSubmit) {
            return TagStatus.NotStarted
        }
        return TagStatus.CannotStartYet;
    }

    isNotSubmittedOrNoChangesMade(tagStatus: TagStatus) {
        return tagStatus == TagStatus.ChangesNotYetSubmitted || tagStatus == TagStatus.NoChangesMade;
    }

    areAllNoChangesMade(tagStatus: TagStatus[]) {
        return tagStatus.every(x => x == TagStatus.NoChangesMade);
    }

}
