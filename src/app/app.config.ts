import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { API_URL } from './core/token/token';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { IMAGE_CONFIG } from '@angular/common';
import { handleErrorInterceptor } from './core/interceptors/handle-error-interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {  TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomTitleStrategy } from './core/DynamicTitle/TitleStrategy';
import { environment } from './core/environment/environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration(),
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    { provide: API_URL, useValue: environment.apiUrl },
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  })    ),

    provideHttpClient(
      withInterceptors([loadingInterceptor, handleErrorInterceptor]),
      withFetch()
    ),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideAnimations(),
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}
