import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function passwordMatchValidator(passwordField:string,confirmField:string):ValidatorFn{
  return (formGroup:AbstractControl):ValidationErrors|null=>{
    const password = formGroup.get(passwordField)?.value;
    const confirmPass = formGroup.get(confirmField)?.value;

    if(password === confirmPass){
      return null;
    }
    formGroup.get(confirmField)?.setErrors({passwordMismatch:true});
    return {passwordMismatch:true};
  }
}
