import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth/auth-service";

export const handleErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): any => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const excludedUrls = [
    "/Users/login",
    "/Users/register",
    "/Users/forget-password",
    "/Users/submit-new-password",
    "/Users/confirm-password-change",
  ];

  if (excludedUrls.some((url) => req.url.toLowerCase().includes(url))) {
    return next(req);
  }

  const myToken = auth.getAccessToken();
  if (myToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((err: any) => {
      if (
        (err.status === 401 || err.status === 403) ) {
        return auth.refreshToken().pipe(
          switchMap((data: any) => {
            auth.saveNewTokens(data);
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${data.accessToken}`,
              },
                withCredentials: true
            });
            return next(clonedReq);
          }),
          catchError((err: any) => {
            toastr.warning(err.message || "Session expired, please login.");
            router.navigate(["/login"]);
            auth.removeAccessToken();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );

};

