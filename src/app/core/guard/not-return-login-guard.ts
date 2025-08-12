import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const notReturnLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  if(auth.getAccessToken()){
    router.navigate(['/Home']);
    return false;
  }
  return true;
};
