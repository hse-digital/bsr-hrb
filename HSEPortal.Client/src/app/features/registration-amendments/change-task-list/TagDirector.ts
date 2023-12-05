import { TaskListSteps, TagStatus } from "./change-task-list.component";
import { ApplicationService, SectionModel, Status } from "src/app/services/application.service";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";
import { ApplicationStageHelper } from "../../application/application-completed/application-completed.component";

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
        if (this.applicationService.currentVersion.ApChangesStatus == Status.ChangesInProgress) {
            return TagStatus.MoreInformationNeeded;
        } else if (this.applicationService.currentVersion.ApChangesStatus == Status.ChangesComplete) {
            return TagStatus.ChangesNotYetSubmitted;
        }
        return TagStatus.NoChangesMade;
    }
}

export class KbiTag extends ChangeTaskListTag {
    private index: number = 0;

    setIndex(index: number): void {
        this.index = index;
    }

    getTag(): TagStatus {
        let kbiSection = this.applicationService.currentVersion.Kbi?.KbiSections.at(this.index);

        if (kbiSection?.Status == Status.ChangesInProgress) {
            return TagStatus.MoreInformationNeeded;
        } else if (kbiSection?.Status == Status.ChangesComplete) {
            return TagStatus.ChangesNotYetSubmitted;
        }
        return TagStatus.NoChangesMade;
    }
}

export class ConnectionsTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        let connections = this.applicationService.currentVersion.Kbi?.Connections;

        if (connections?.Status == Status.ChangesInProgress) {
            return TagStatus.MoreInformationNeeded;
        } else if (connections?.Status == Status.ChangesComplete) {
            return TagStatus.ChangesNotYetSubmitted;
        }
        return TagStatus.NoChangesMade;
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
        let kbiTagStatus = this.getKbiTags();
        let connectionsTagStatus = new ConnectionsTag(this.applicationService).getTag();
        let accountablePersonTag = new AccountablePersonTag(this.applicationService).getTag();
 
        let canSubmit = !this.areAllNoChangesMade([changeUserTagStatus, changeBuildingSummaryTagStatus, ...kbiTagStatus, connectionsTagStatus, accountablePersonTag]) 
            && this.isNotSubmittedOrNoChangesMade(changeUserTagStatus) 
            && this.isNotSubmittedOrNoChangesMade(changeBuildingSummaryTagStatus)
            && this.isNotSubmittedOrNoChangesMade(accountablePersonTag)
            && this.isNotSubmittedOrNoChangesMade(connectionsTagStatus);
            
        if (ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus)) {
            canSubmit &&= kbiTagStatus.every(x => this.isNotSubmittedOrNoChangesMade(x));
        }

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

    getKbiTags() {
        let tags = [];
        let kbiTag: KbiTag = new KbiTag(this.applicationService);
        for (let index = 0; index < this.applicationService.currentVersion.Kbi!.KbiSections.length; index++) {
            kbiTag.setIndex(index);
            tags.push(kbiTag.getTag());
        }
        return tags;
    }

}
