import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'timeout-modal',
    templateUrl: './timeout.modal.html',
    styleUrls: ['./timeout.modal.scss'],
})
export class TimeoutModalComponent implements OnInit {
    @Input() delayToTimeout!: number;
    _remainingSeconds!: number;

    @Output() onContinueClicked = new EventEmitter();
    @Output() onSaveAndComebackClicked = new EventEmitter();
    @Output() onTimeout = new EventEmitter();

    interval?: any;
    ngOnInit(): void {
        this._remainingSeconds = this.delayToTimeout;

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this._remainingSeconds -= 1;
            if (this._remainingSeconds == 0) {
                this.onTimeout.emit();
                clearInterval(this.interval);
            }
        }, 1000);
    }

    getTimeRemaining() {
        if (this._remainingSeconds && this._remainingSeconds < 60) {
            return `${this._remainingSeconds} second(s)`;
        }

        return '2 minutes';
    }
}