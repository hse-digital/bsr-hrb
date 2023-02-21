import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { IdleTimerService } from "src/app/services/idle-timer.service";

@Component({
    selector: 'timeout-modal',
    templateUrl: './timeout.modal.html',
    styleUrls: ['./timeout.modal.scss'],
})
export class TimeoutModalComponent implements OnInit {
    constructor(private idleTimerService: IdleTimerService) {
    }

    @Output() onContinueClicked = new EventEmitter();
    @Output() onSaveAndComebackClicked = new EventEmitter();
    @Output() onTimeout = new EventEmitter();

    ngOnInit(): void {
        this.idleTimerService.initTimer(2 * 60, () => this.onTimeout.emit());
    }
}