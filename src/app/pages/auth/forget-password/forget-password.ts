import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-forget-password',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss'
})
export class ForgetPassword {
ForgetForm:FormGroup = new FormGroup('');
constructor(
  private FB:FormBuilder,
  private tostar:ToastrService,
  private auth:AuthService,
private router:Router){
  this.ForgetForm = this.FB.group({
    email:['',[Validators.required,Validators.email]],
  })
}
get email(){
  return this.ForgetForm.controls['email'];
}

onsubmit(){
if(this.ForgetForm.invalid){
  this.tostar.warning("Please Enter All Fields","Not Get AnyThing 😈");
  return;
}
this.auth.forgetPassword(this.ForgetForm.value).subscribe({
  next:(res:any)=>{
    this.router.navigate(['/login']);
    this.tostar.success("This is Correct Please Check Your Email for get Reset Password");
  },
  error:(err)=>{
        this.tostar.error(err.error || "Failed to send reset link");
    console.log(err);

  }
})
}

}
