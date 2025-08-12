import { InjectionToken } from "@angular/core";

export const API_URL = new InjectionToken<string>('api_url');

export const BROWSER_STORAGE = new InjectionToken<Storage>("browserStorage",{
  factory:()=> localStorage,
  providedIn:"root",
});
