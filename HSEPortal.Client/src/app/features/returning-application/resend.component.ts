import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    selector: 'application-resend',
    templateUrl: './resend.component.html'
})
export class ReturningApplicationResendCodeComponent {

    @Input() emailAddress!: string;
    @Output() onVerificationCodeSent = new EventEmitter();
    
    sendingRequest = false;

    constructor(private applicationService: ApplicationService) { }
    
    async sendNewCode() {
        this.sendingRequest = true;       
        await this.applicationService.sendVerificationEmail(this.emailAddress!); 
        this.onVerificationCodeSent.emit();
    }
}