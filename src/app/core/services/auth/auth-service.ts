import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenServices } from '../browser/TokenServices';
import { API_URL } from '../../token/token';
import { Observable } from 'rxjs';
import { IUserLogin } from '../../model/IuserLogin';
import { IUserSignUp } from '../../model/IuserSignup';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseURL: string = inject(API_URL);

  constructor(private http: HttpClient, private tokenService: TokenServices) {}

  login(model: IUserLogin): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<{ accessToken: string }>(`${this.baseURL}Auth/login`, model, {
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            this.tokenService.setAccessToken(res.accessToken);
            observer.next(res);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  signup(model: IUserSignUp): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<{ accessToken: string }>(`${this.baseURL}Auth/register`, model, {
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            this.tokenService.setAccessToken(res.accessToken);
            observer.next(res);
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  refreshToken(): Observable<any> {
    return new Observable<any>((observer) => {
      this.http
        .post<{ accessToken: string }>(
          `${this.baseURL}Auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: (res) => {
            this.tokenService.setAccessToken(res.accessToken);
            observer.next(res.accessToken);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  saveNewTokens(tokens: { accessToken: string }) {
    this.tokenService.setAccessToken(tokens.accessToken);
  }

  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }
  removeAccessToken() {
    this.tokenService.clearAccessToken();
  }
  logout(): Observable<any> {
    return this.http.post(
      `${this.baseURL}Auth/logout`,
      {},
      {
        withCredentials: true,
          headers: new HttpHeaders({
    Authorization: 'Bearer ' + this.tokenService.getAccessToken()
  })
      }
    );
  }
  handleCredentialResponse(response: any) {
    const credential = response.credential;
    return this.http.post<any>(
      `${this.baseURL}Auth/GoogleResponse`,
      {
        idToken: credential,
        provider: 'Google',
      },
      {
        withCredentials: true,
      }
    );
  }

 loginWithGoogle(idToken: string, recaptchaToken: string) {
  return this.http.post(`${this.baseURL}ExternalAuth/signin-google`, {
    idToken,
    recaptchaToken
  },{withCredentials:true});
}

loginWithFacebook(idToken: string, recaptchaToken: string) {
  return this.http.post(`${this.baseURL}ExternalAuth/signin-facebook`, {
    idToken,
    recaptchaToken
  },{withCredentials:true});
}


  forgetPassword(data:any){
  return this.http.post(`${this.baseURL}Forget/forget-password`, data, { withCredentials:true,responseType: 'text' });
}

  submitNewPassword(data:any): Observable<any> {
    return this.http.post(`${this.baseURL}Forget/submit-new-password`, data,{withCredentials:true,responseType:"text"});
  }

 confirmPasswordChange(token: string, action: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('action', action);
    return this.http.get(`${this.baseURL}Forget/confirm-password-change`, { params: params,withCredentials:true });
  }

}
