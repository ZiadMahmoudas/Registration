import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth-service';

export const dashboardGuard: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const accessToken: any = auth.getAccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  const role = decoded[roleClaim];
  const isAdmin = true;
    if (!accessToken) {
    router.navigate(['/login']);
    return false;
  }
  if (role === 'Admin' || role === "Staff") {
    return isAdmin;
  }
return !isAdmin;
};
