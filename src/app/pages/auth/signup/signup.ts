import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MetaService } from '../../../core/meta/meta-service';
import ValidatorForm from '../../../core/validation/formVaildators';
import { passwordMatchValidator } from '../../../core/validation/passMatch.vaildator';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  standalone:true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
isEyeOpen = signal(true);
passwordInputRef = viewChild('passwordInput',{read:ElementRef})

confirmPasswordField = viewChild('#confirmPasswordField',{read:ElementRef})
isConfirmPasswordEyeOpen = signal(true);


 togglePasswordEye(inputElement: any) {
    this.isEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
toggleConfirmPasswordEye(inputElement: any) {
    this.isConfirmPasswordEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
  successMatch:boolean = false;
ngOnInit():void{
  this.metaService.setMeta();
this.toggleConfirmPasswordEye(this.confirmPasswordField);
this.togglePasswordEye(this.passwordInputRef);
this.signupForm.statusChanges.subscribe(status=>{
  const hasError = this.signupForm.hasError("passwordMismatch");
  const confirmTouched = this.signupForm.get("confirmPassword")?.touched;

  if(!hasError && confirmTouched){
    this.successMatch = true;
    setTimeout(()=>{
      this.successMatch =false;
    },3000)
  }
})
}
signupForm:FormGroup = new FormGroup('');
constructor(
  private tostar:ToastrService,
  private FB:FormBuilder,
  private auth:AuthService,
  private router:Router,
  private metaService:MetaService
  ){
  this.signupForm = this.FB.group({
    email:['',
      [Validators.required,
        Validators.email,
      Validators.pattern(/\w+@(gmail|mail|outlook).(com|net|org)$/i)],
    ],
    userName:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    password:['',[Validators.required]],
    confirmPassword:['',[Validators.required]],
  },
  {
    Validator: passwordMatchValidator('password', 'confirmPassword')
  }
)
}

  get userName(){
    return this.signupForm.controls['userName'];
  }
  get password(){
    return this.signupForm.controls['password'];
  }
  get email(){
    return this.signupForm.controls['email'];
  }
  get confirmPassword(){
    return this.signupForm.controls['confirmPassword'];
  }

onsubmit(){
if(this.signupForm.invalid){
     ValidatorForm.ValidateAllFormFields(this.signupForm);
    this.tostar.warning("Please Enter All Fields","Not Get AnyThing 😈")
  return;
}
this.auth.signup(this.signupForm.value).subscribe({
  next:(res:any)=>{
    this.tostar.success("Thanks For Success in my website","Welcome happy For you");
      this.auth.saveNewTokens(res);
            this.signupForm.reset();
      this.router.navigate(['/Home']);
  },
  error:(err)=>{
    if(err.status === 409)
      this.tostar.error("😬Oops Conflict:This Email is Already Exist");
  }
})
}
invalidLogin:boolean = false;
isInvalid(controlName: string): any {
  const control = this.signupForm.get(controlName);
  if (!control) return false;

  return (control.invalid && (control.dirty || control.touched)) || this.invalidLogin;
}
isValid(controlName: string): any {
  const control = this.signupForm.get(controlName);
  if (!control) return false;

  return control.valid && (control.dirty || control.touched) && !this.invalidLogin;
}
}
