import { CartService } from './../../core/services/Cart/cart-service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth/auth-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  constructor(
    private router:Router,
    private auth:AuthService,
    private CartService:CartService,
    private tostar:ToastrService
  ){}

  currentUserId:number = 0;
ngOnInit() {
  const roleClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
  const accessToken: any = this.auth.getAccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  this.currentUserId = +decoded[roleClaim];

this.loadItem();
this.CartService.totalPrice$.subscribe(total => {
    this.totalPrice = total;
  });
}
loadItem(){
    this.CartService.loadCart(this.currentUserId).subscribe({
    next: items => this.items = items,
    error: err => console.error('Failed to load cart', err)
  });
}
add(){
  this.router.navigateByUrl("Order");
}
items:any = []
totalPrice: number = 0;

RemoveWishList(cartId: number) {
  this.CartService.removeFromCart(cartId).subscribe({
    next: (res:any) => {
      console.log('Response from server:', res);
      this.tostar.success("تم الحذف أو تقليل الكمية بنجاح");
    },
    error: () => {
      this.tostar.error("حدث خطأ أثناء الحذف");
    }
  });
}

addItem(productId: number, quantity:number) {
  this.CartService.addToCart(this.currentUserId, productId, quantity).subscribe({
    next: () => {
    
      this.tostar.success("تم الاضافة بنجاح");
    },
    error: () => {
      this.tostar.error("حدث خطأ أثناء الاضافة");
    }
  });
}
goToShop(){
  this.router.navigateByUrl("/Home")
}

}
