import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MetaService } from '../../../core/meta/meta-service';
import ValidatorForm from '../../../core/validation/formVaildators';
import { AuthService } from '../../../core/services/auth/auth-service';
import { TokenServices } from '../../../core/services/browser/TokenServices';
import { RecaptchaModule } from "ng-recaptcha";
import { jwtDecode } from 'jwt-decode';
import { ItemsService } from '../../../core/services/Cart&WishListServices/items-services';
import { CartService } from '../../../core/services/Cart/cart-service';

declare const google: any;
declare var FB: any;
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,CommonModule,RecaptchaModule],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.scss',

})

export class Login {

isEyeOpen = signal(true);
passwordInputRef = viewChild('passwordInput',{read:ElementRef})
  togglePasswordEye(inputElement: any) {
    this.isEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
  currentUserId:number = 0;
  ngOnInit():void{
    this.metaService.setMeta();
this.togglePasswordEye(this.passwordInputRef);
  const roleClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
  const accessToken: any = this.auth.getAccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  const currentUserId = +decoded[roleClaim];
  this.currentUserId = currentUserId;

  }

  loginForm:FormGroup = new FormGroup('');

  constructor(
    private FB:FormBuilder,
    private auth:AuthService,
    private authService:AuthService,
    private toastr:ToastrService,
    private router:Router,
    private metaService:MetaService,
    private TokenService:TokenServices,
    private items: ItemsService,
    private CartService:CartService

  ){
   this.loginForm = this.FB.group({
    email:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    password:['',[Validators.required]],
    });

  }

  get email(){
    return this.loginForm.controls['email'];
  }
  get password(){
    return this.loginForm.controls['password'];
  }

  recaptchaToken:string | null = null;
invalidLogin:boolean = false;
onsubmit() {
  if (this.loginForm.invalid || !this.recaptchaToken) {
    ValidatorForm.ValidateAllFormFields(this.loginForm);
    this.toastr.warning("Please fill in all fields and complete the captcha", "Validation Error");
    return;
  }

  const formData = {
    ...this.loginForm.value,
    recaptchaToken: this.recaptchaToken
  };

  this.auth.login(formData).subscribe({
  next: (res) => {
    this.auth.saveNewTokens(res);
    const roleClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const decoded = jwtDecode<{ [key: string]: any }>(res.accessToken);
    const currentUserId = +decoded[roleClaim];
        this.items.setCurrentUserId(currentUserId);
        this.CartService.loadCartFromServer(currentUserId).subscribe();

this.items.fetchAndStoreWishlist(currentUserId).subscribe({
      next: () => {
        this.router.navigate(['/Home']);
      },
      error: () => {
        this.toastr.error('Failed to load wishlist after login');
      }
    });

  },
    error: () => {
      this.invalidLogin = true;
      this.toastr.error("Login failed", "Please try again");
    }
  });
}
onCaptchaResolved(token: any) {
  this.recaptchaToken = token;
}
isInvalid(controlName: string): any {
  const control = this.loginForm.get(controlName);
  if (!control) return false;
  if (this.invalidLogin && control.dirty && !control.invalid) {
    return false;
  }

  return (control.invalid && (control.dirty || control.touched)) || this.invalidLogin;
}
isValid(controlName: string): any {
  const control = this.loginForm.get(controlName);
  if (!control) return false;

  return control.valid && (control.dirty || control.touched) && !this.invalidLogin;
}

 ngAfterViewInit(): void {
    this.loginWithGoogle();
  }

  loginWithGoogle(): void {
    google.accounts.id.initialize({
      client_id: '799712541569-lm1a9m98asgu88jeiumkq4l9s1l3lo8h.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById("login-button"),
      { theme: "outline", size: "large" }
    );

    // google.accounts.id.prompt();
  }
handleCredentialResponse(response: any): void {
  const googleIdToken = response.credential;

  if (!this.recaptchaToken) {
    this.toastr.error("Please complete the captcha before using Google login");
    return;
  }

  const externalAuth = {
    idToken: googleIdToken,
    recaptchaToken: this.recaptchaToken,
    provider: 'Google'
  };

  this.authService.loginWithGoogle(
    externalAuth.idToken,
    externalAuth.recaptchaToken
  ).subscribe({
    next: (res: any) => {
      this.toastr.success('Logged in with Google');
      this.TokenService.setAccessToken(res.accessToken);
      this.router.navigateByUrl("/Home");
    },
    error: (err) => {
      console.error("Google login error:", err);
      this.toastr.error("Google login failed");
    }
  });
}

loginWithFacebook() {
  if (!this.recaptchaToken) {
    this.toastr.error("Please complete the captcha before using Facebook login");
    return;
  }

  FB.login((response: any) => {
    if (response.authResponse) {
      const fbAccessToken = response.authResponse.accessToken;

      this.authService.loginWithFacebook(fbAccessToken, this.recaptchaToken).subscribe({
        next: (res: any) => {
          this.toastr.success('Logged in with Facebook');
          this.TokenService.setAccessToken(res.accessToken);
          this.router.navigateByUrl("/Home");
        },
        error: (err) => {
          console.error('Facebook login error:', err);
          this.toastr.error('Facebook login failed');
        }
      });
    } else {
      console.warn('User cancelled Facebook login or did not authorize.');
    }
  }, { scope: 'email,public_profile' });
}
}
