import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ToolValidators {

    private static emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    static emails(control: AbstractControl) {
        if(!control.value) return null;
        let emails = control.value.split('\n').map(email => email.trim()).filter(email => email !== '');
        let invalidEmail = emails.find(ToolValidators.isInvalidEmail);
        return invalidEmail ? ToolValidators.generateInvalidEmailError(invalidEmail) : null;
    }
    
    private static isInvalidEmail(email: string): boolean {
        return !ToolValidators.emailRegex.test(email);
    }

    private static generateInvalidEmailError(invalidEmail: string): ValidationErrors {
        return {
            emailListValidator: {
                value: invalidEmail
            }
        };
    }

}