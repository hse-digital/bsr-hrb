import { RegistrationAmendmentsService, Status } from "src/app/services/registration-amendments.service";
import { TaskListSteps, TagStatus } from "./change-task-list.component";

export class TagDirector {
    Tag?: ChangeTaskListTag;

    constructor(protected registrationAmendmentsService: RegistrationAmendmentsService) { }

    setStep(step: TaskListSteps, index?: number): this {
        switch (step) {
            case TaskListSteps.BuildingSummary:
                this.Tag = new BuildingSummaryTag(this.registrationAmendmentsService); break;
            case TaskListSteps.AccountablePerson:
                this.Tag = new AccountablePersonTag(this.registrationAmendmentsService); break;
            case TaskListSteps.Kbi:
                this.Tag = new KbiTag(this.registrationAmendmentsService);
                (this.Tag as KbiTag).setIndex(index ?? 0); break;
            case TaskListSteps.Connections:
                this.Tag = new ConnectionsTag(this.registrationAmendmentsService); break;
            case TaskListSteps.Changes:
                this.Tag = new ChangesTag(this.registrationAmendmentsService); break;
            case TaskListSteps.Submit:
                this.Tag = new SubmitTag(this.registrationAmendmentsService); break;
        }
        return this;
    }

    getTag() {
        if (!this.Tag) return TagStatus.NotYetAvailable;
        return this.Tag.getTag();
    }
}

export abstract class ChangeTaskListTag {
    constructor(protected registrationAmendmentsService: RegistrationAmendmentsService) { }

    abstract getTag(index?: number): TagStatus;
}

export class BuildingSummaryTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        return TagStatus.NotYetAvailable;
    }
}

export class AccountablePersonTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        return TagStatus.NotYetAvailable;
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
        let submitStatus = this.registrationAmendmentsService.model?.SubmitStatus;
        if (!submitStatus) return TagStatus.NotYetAvailable;

        if (submitStatus.ContainsFlag(Status.NoChanges)) {
            return TagStatus.NoChangesMade;
        } else if (submitStatus.ContainsFlag(Status.ChangesInProgress)) {
            return TagStatus.MoreInformationNeeded;
        } else if (submitStatus.ContainsFlag(Status.ChangesComplete)) {
            return TagStatus.ChangesNotYetSubmitted;
        }

        return TagStatus.NotYetAvailable;
    }
}

export class SubmitTag extends ChangeTaskListTag {
    getTag(): TagStatus {
        let manageAccessStatus = this.registrationAmendmentsService.model?.ManageAccessStatus;
        if (!manageAccessStatus) return TagStatus.NotYetAvailable;

        if (manageAccessStatus.ContainsFlag(Status.NoChanges)) {
            return TagStatus.NoChangesMade;
        } else if (manageAccessStatus.ContainsFlag(Status.ChangesInProgress)) {
            return TagStatus.MoreInformationNeeded;
        } else if (manageAccessStatus.ContainsFlag(Status.ChangesComplete)) {
            return TagStatus.ChangesNotYetSubmitted;
        }

        return TagStatus.NotYetAvailable;
    }
}
