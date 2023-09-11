import { Injectable } from '@angular/core';

@Injectable()
export class RegistrationAmendmentsService {
  model?: RegistrationAmendmentModel;

  constructor() {
    this.model = new RegistrationAmendmentModel();
  }
}

export class RegistrationAmendmentModel {
  BuildingSummaryStatus: RegistrationAmendmentStatus = new RegistrationAmendmentStatus();
  AccountablePersonStatus: RegistrationAmendmentStatus = new RegistrationAmendmentStatus();
  ConnectionStatus: RegistrationAmendmentStatus = new RegistrationAmendmentStatus();
  ManageAccessStatus: RegistrationAmendmentStatus = new RegistrationAmendmentStatus();
  SubmitStatus: RegistrationAmendmentStatus = new RegistrationAmendmentStatus();

  WhatWantToDo?: string;
}

export class RegistrationAmendmentStatus {
  Status: Status = Status.NoChanges;

  constructor() {
    if(!this.Status) this.Status = Status.NoChanges;
  }

  AddFlag(flag: Status): void {
    this.Status = this.Status | flag;
  }

  RemoveFlag(flag: Status): void {
    this.Status = this.Status &= ~flag;
  }

  ContainsFlag(flag: Status): boolean {
    return (this.Status & flag) == flag;
  }
}

export enum Status {
  NoChanges = 0,
  ChangesInProgress = 1,
  ChangesComplete = 2,
}
