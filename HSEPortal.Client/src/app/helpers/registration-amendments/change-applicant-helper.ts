import { ApplicationService, Status } from "src/app/services/application.service";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeApplicantHelper {
    
    private applicationService: ApplicationService;
    
    constructor(applicationService: ApplicationService) {
        this.applicationService = applicationService;
    }

    getNewPrimaryAnswer() {
        let newPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
        return `${newPrimaryUser?.Firstname} ${newPrimaryUser?.Lastname} - ${newPrimaryUser?.Email} - ${newPrimaryUser?.PhoneNumber}`;   
    }

    getOriginalPrimaryAnswer() {
        return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName} - ${this.applicationService.model.ContactEmailAddress} - ${this.applicationService.model.ContactPhoneNumber}`;
    }

    getNewSecondaryAnswer() {
        let newSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
        let newAnswer = "None";
        if (FieldValidations.IsNotNullOrWhitespace(newSecondaryUser?.Email) && FieldValidations.IsNotNullOrWhitespace(newSecondaryUser?.Firstname)) {
          newAnswer = `${newSecondaryUser?.Firstname} ${newSecondaryUser?.Lastname} - ${newSecondaryUser?.Email} - ${newSecondaryUser?.PhoneNumber}`;
        }
        return newAnswer;
    }

    getOriginalSecondaryAnswer() {
        let originalAnswer = "None";
        if (FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryEmailAddress) && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryFirstName)) {
          originalAnswer = `${this.applicationService.model.SecondaryFirstName} ${this.applicationService.model.SecondaryLastName} - ${this.applicationService.model.SecondaryEmailAddress} - ${this.applicationService.model.SecondaryPhoneNumber}`;
        }
        return originalAnswer;
    }

    updateSecondaryUser() {
        let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser
        this.applicationService.model.SecondaryEmailAddress = secondaryUser?.Email;
        this.applicationService.model.SecondaryFirstName = secondaryUser?.Firstname;
        this.applicationService.model.SecondaryLastName = secondaryUser?.Lastname;
        this.applicationService.model.SecondaryPhoneNumber = secondaryUser?.PhoneNumber;
    }
    
    deleteSecondaryUser() {
        delete this.applicationService.model.SecondaryEmailAddress;
        delete this.applicationService.model.SecondaryFirstName;
        delete this.applicationService.model.SecondaryLastName;
        delete this.applicationService.model.SecondaryPhoneNumber;

        delete this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;
        delete this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    }

    deleteNewSecondaryUser() {
        delete this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser;
    }

    changePrimaryUserStatusToSubmitted() {
        this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status = Status.ChangesSubmitted;
    }

    setNewPrimaryUserEmail() {
        let NewPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser;
        if (!!NewPrimaryUser) {
          this.applicationService.model.NewPrimaryUserEmail = NewPrimaryUser?.Email;
        }
    }

    setSecondaryUser() {
        let NewSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;  
        this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser = {
            Status: Status.ChangesSubmitted,
            Email: NewSecondaryUser?.Email,
            Firstname: NewSecondaryUser?.Firstname,
            Lastname: NewSecondaryUser?.Lastname,
            PhoneNumber: NewSecondaryUser?.PhoneNumber
        }
    }

    newSecondaryUserExists() {
        let NewSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
        return !!NewSecondaryUser && FieldValidations.IsNotNullOrWhitespace(NewSecondaryUser.Email) && FieldValidations.IsNotNullOrWhitespace(NewSecondaryUser.Firstname)
    }

    isSecondaryUserRemoved() {
        let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;
        return secondaryUser?.Status == Status.Removed
    }

}