import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

loaderStartTime:number = 0
  show(){
    this.loaderStartTime = Date.now();
    this._loading.next(true);
  }
  hide(){
    const elapsedTime = Date.now() - this.loaderStartTime;
    const MIN_DISPLAY_TIME = 1000;

    const remainingTime = MIN_DISPLAY_TIME - elapsedTime;

    if (remainingTime > 0) {
      setTimeout(() => this._loading.next(false), remainingTime);
    } else {
      this._loading.next(false);
    }
  }
}
