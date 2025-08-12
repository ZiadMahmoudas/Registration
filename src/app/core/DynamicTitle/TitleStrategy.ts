import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import {  TranslateService } from '@ngx-translate/core';
@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private translate: TranslateService
  ) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);
    if (titleKey) {
      this.translate.get(titleKey).subscribe(translatedTitle => {
        this.title.setTitle(translatedTitle);
      });
    }
  }
}
