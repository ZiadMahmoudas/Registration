import { Routes } from '@angular/router';
import { notReturnLoginGuard } from './core/guard/not-return-login-guard';
import { authGuard } from './core/guard/auth-guard';
import { dashboardGuard } from './core/guard/dashboard-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: 'Home', redirectTo: 'Home' },
  {
    path: 'signup',
    title: 'signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup').then((c) => c.Signup),
    canActivate: [notReturnLoginGuard],
    data: {
      description: 'signup Page Hi Good',
    },
  },
  {
    path: 'forgetPassword',
    title: 'forgetPassword',
    loadComponent: () =>
      import('./pages/auth/forget-password/forget-password').then(
        (c) => c.ForgetPassword
      ),
    canActivate: [notReturnLoginGuard],
  },
  {
    path: 'passwordReset',
    title: 'passwordReset',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password').then(
        (c) => c.ResetPassword
      ),
    canActivate: [notReturnLoginGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((c) => c.Login),
    title: 'login',
    canActivate: [notReturnLoginGuard],
    data: {
      description: 'login Page Hi Bye',
    },
  },
  {
    path: 'view/:id',
    title: 'VIEW_PRODUCT',
    loadComponent: () => import('./pages/view/view').then((c) => c.View),
    canActivate: [authGuard],
  },
  {
    path: 'Home',
    title: 'Home',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
    // canActivate: [authGuard],
  },
  {
    path: 'Cart',
    title: 'Cart',
    loadComponent: () => import('./pages/cart/cart').then((c) => c.Cart),
    // canActivate: [authGuard],
  },
  {
    path: 'Order',
    title: 'Order',
    loadComponent: () => import('./pages/order/order').then((c) => c.Order),
    // canActivate: [authGuard],
  },
  {
    path: 'checkout',
    title: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout/checkout').then((c) => c.Checkout),
    canActivate: [authGuard],
  },
  {
    path: 'Dashboard',
    title: 'Dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
    canMatch: [dashboardGuard],
    children: [
      {
        path: 'users',
        title: 'users',
        loadComponent: () =>
          import('./pages/dashboard/users/users').then((c) => c.Users),
      },
      {
        path: 'Product',
        title: 'Product',
        loadComponent: () =>
          import('./pages/dashboard/product/product').then((c) => c.Product),
      },
      {
        path: 'Admin',
        title: 'Admin',
        loadComponent: () =>
          import('./pages/dashboard/admins/add-admin').then((c) => c.AddAdmin),
      },
      {
        path: 'Staff',
        title: 'Staff',
        loadComponent: () =>
          import('./pages/dashboard/Staff/staff/staff').then((c) => c.Staff),
      },
      {
        path: 'Offer',
        title: 'Offer',
        loadComponent: () =>
          import('./pages/dashboard/offer/offer/offer').then((c) => c.Offer),
      },
      {
        path: 'displayOffer',
        title: 'displayOffer',
        loadComponent: () =>
          import('./pages/dashboard/display-offer/display-offer').then(
            (c) => c.DisplayOffer
          ),
      },

      {
        path: 'product/:id',
        title: 'Edit Product',
        loadComponent: () =>
          import('./pages/dashboard/product/product').then((c) => c.Product),
      },
      {
        path: 'Offer/:id',
        title: 'Edit Offer',
        loadComponent: () =>
          import('./pages/dashboard/offer/offer/offer').then((c) => c.Offer),
      },
    ],
  },
  {
    path: 'WishList',
    title: 'WishList',
    loadComponent: () =>
      import('./pages/wish-list/wish-list').then((c) => c.WishList),
    canActivate: [authGuard],
  },
  {
    path: '**',
    title: '404',
    loadComponent: () =>
      import('./main-layout/notfound/notfound').then((c) => c.Notfound),
  },
];
