import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader/loader.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

   const loadService = inject(LoaderService);
    loadService.show();
    return next(req).pipe(
      finalize(()=>{
          loadService.hide();
      })
    )
};
