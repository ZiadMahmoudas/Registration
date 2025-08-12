import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth/auth-service';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from '../../core/services/Cart&WishListServices/items-services';
import { UsersServices } from '../../core/services/dashboard/AllusersInfo/UsersServices';

@Component({
  selector: 'app-wish-list',
  imports: [],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.scss'
})
export class WishList {
items:any = [];
constructor(
  private itemsService:ItemsService,
  private auth:AuthService,
  private tostar:ToastrService,
  private userService:UsersServices
){

}
currentUserId:number = 0;
ngOnInit(){
  const roleClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const accessToken: any = this.auth.getAccessToken();
    const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
    this.currentUserId = +decoded[roleClaim];

    this.itemsService.loadWishlistFromStorage();

    this.itemsService.fetchAndStoreWishlist(this.currentUserId).subscribe();

  this.itemsService.wishlistItems$.subscribe(items => {
    this.items = items; 
    console.log(this.items); 
  });
}
addToCart(){

}

  RemoveWishList(wishListId: number) {
    this.itemsService.removeFromWishlist(wishListId).subscribe({
      next: () => {
        this.tostar.success("تم الحذف بنجاح");
      },
      error: () => {
        this.tostar.error("حدث خطأ أثناء الحذف");
      }
    });
  }
}
