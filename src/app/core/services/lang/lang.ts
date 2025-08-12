import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Router, TitleStrategy } from '@angular/router';
import { TokenServices } from '../browser/TokenServices';

@Injectable({ providedIn: 'root' })
export class LangService {
  private currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private storage:TokenServices,
    private titleStrategy: TitleStrategy
  ) {
    const savedLang = (this.storage.get('lang') as 'ar' | 'en') || 'ar';
    this.setLanguage(savedLang);
  }

  toggleLang() {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  private setLanguage(lang: 'ar' | 'en') {
    this.currentLang = lang;
    this.storage.set('lang', lang);

    this.translate.use(lang).subscribe(() => {
      this.translate.setDefaultLang(lang);
      this.setDirection(lang);

      const currentSnapshot = this.router.routerState.snapshot;

      this.titleStrategy.updateTitle(currentSnapshot);
    });
  }

  private setDirection(lang: 'ar' | 'en') {
    this.document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
}
