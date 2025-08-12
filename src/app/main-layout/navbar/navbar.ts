import { CartService } from './../../core/services/Cart/cart-service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { LangService } from '../../core/services/lang/lang';
import { CommonModule } from '@angular/common';
import { TokenServices } from '../../core/services/browser/TokenServices';
import { Subscription } from 'rxjs';
import { ItemsService } from '../../core/services/Cart&WishListServices/items-services';
import { UsersServices } from '../../core/services/dashboard/AllusersInfo/UsersServices';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  searchTerm:string = "";
  constructor(
    private auth:AuthService
    ,private tostar:ToastrService
    ,private router:Router,
    private langService:LangService,
    private itemsService:ItemsService,
    private userService:UsersServices,
    private CartService:CartService
  ){}

logout() {
  this.auth.logout().subscribe({
    next: () => {
      this.auth.removeAccessToken();
      this.itemsService.clearWishlist();
    this.CartService.clearCartLocal();
      this.router.navigate(['/login']);
      this.tostar.success("You have successfully logged out.");
      this.CartService.cartCount$.subscribe
    },
    error: () => {
      this.tostar.error("Logout failed");
    }
  });
}
get isAccess():boolean{
  return !!this.auth.getAccessToken()
}
role:string = '';
decode:any;
accessToken:any;
 get isAdmin(): boolean {
  const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const token = this.auth.getAccessToken();
  if (!token) return false;

  const decoded = jwtDecode<{ [key: string]: any }>(token);
  const role = decoded[roleClaim] || '';

  return role === 'Admin';
}
 get isStaff(): boolean {
  const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const token = this.auth.getAccessToken();
  if (!token) return false;

  const decoded = jwtDecode<{ [key: string]: any }>(token);
  const role = decoded[roleClaim] || '';

  return role === 'Staff';
}
  wishlistCount:number = 0;
  private wishlistCountSub?: Subscription;
ngOnInit(){
  this.itemsService.wishlistItems$.subscribe(ids => {
    this.wishlistCount = ids.length;
  });
 this.CartService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });
  const token = this.auth.getAccessToken();
  if (token) {
    const decoded = jwtDecode<{ [key: string]: any }>(token);
    const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    this.CartService.loadCartFromServer(userId).subscribe();
  }
  this.itemsService.loadWishlistFromStorage();

    this.userService.GetAllProduct().subscribe(products => {
    this.products = products;
  });
}
  ngOnDestroy() {
    this.wishlistCountSub?.unsubscribe();
  }
searchResults:any = [];
products:any = []
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (term.length === 0) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.products.filter(product =>
      product.productName.toLowerCase().includes(term)
    ).slice(0, 5); 
  }

  goToProduct(id: number): void {
    this.searchTerm = '';
    this.searchResults = [];
   this.router.navigate(['/view', id]);
  }

changeLanguage(lang:string) {
    this.langService.toggleLang();
  }

  cartCount: number = 0;
}
