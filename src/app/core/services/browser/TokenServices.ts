import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../../token/token';

@Injectable({
  providedIn: 'root'
})
export class TokenServices {
  private accessTokenKey = 'accessToken';

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  clearAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }
  constructor(@Inject(BROWSER_STORAGE) public storage:Storage) { }


  /* For Theme / language */
   get(key:string){
    return this.storage.getItem(key);
  }
  set(key:string,value:string){
    this.storage.setItem(key,value);
  }
  remove(key:string){
    this.storage.removeItem(key);
  }
}
