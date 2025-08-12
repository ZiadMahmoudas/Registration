import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UsersServices } from '../../core/services/dashboard/AllusersInfo/UsersServices';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth/auth-service';
import Swal from 'sweetalert2';
import { TokenServices } from '../../core/services/browser/TokenServices';
import { LimitletterPipe } from '../../core/pipe/limitletter-pipe';
import { ItemsService } from '../../core/services/Cart&WishListServices/items-services';
import { CartService } from '../../core/services/Cart/cart-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, LimitletterPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  products: any[] = [];
  wishlistItems: any[] = [];
  currentUserId: number;
  visibleProducts: any[] = [];
  tags: any[] = [];
  activeTag: number | null = null;
  itemsPerPage = 7;
  currentIndex = 0;
wishlistIds
  customOptions: OwlOptions = { loop: true, mouseDrag: true, touchDrag: true, dots: false, autoplay: true, autoplaySpeed: 2000, navSpeed: 700, navText: ['', ''], responsive: { 0: { items: 1 } }, nav: false };

  @ViewChild('shopSection') shopSection!: ElementRef;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private dashboardServices: UsersServices,
    private auth: AuthService,
    private itemsService: ItemsService,
    private cartService:CartService
  ) {}

  ngOnInit() {
    const roleClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const accessToken: any = this.auth.getAccessToken();
    const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
    this.currentUserId = +decoded[roleClaim];

  this.itemsService.wishlistItems$.subscribe(ids => {
    this.wishlistItems = ids;
      this.wishlistIds = ids.map(i => i.productId);
  });
    this.loadTags();
    this.loadProducts();
    this.itemsService.fetchAndStoreWishlist(this.currentUserId).subscribe();
  }

  loadProducts() {
    this.dashboardServices.GetAllProduct().subscribe(res => {
      this.products = res;
      this.resetVisibleProducts();
    });
  }

toggleWishlist(product: any) {
  const productId = product.productId ?? product.id;
  const wishlistItem = this.wishlistItems.find(i => i.productId === productId);
  if (wishlistItem) {
 this.itemsService.removeFromWishlist(wishlistItem.wishListId || wishlistItem.wishlistId).subscribe(() => { 
       this.itemsService.fetchAndStoreWishlist(this.currentUserId).subscribe();
    });
  } else {
    const payload = {
      userId: this.currentUserId,
      product: { productId }
    };
    this.itemsService.addToWishlist(payload).subscribe(() => {
      this.itemsService.fetchAndStoreWishlist(this.currentUserId).subscribe();
    });
  }
}
isInWishlist(productId: number): boolean {
  return this.wishlistItems.some(item => item.productId === productId);
}

  loadTags() {
    this.dashboardServices.getAllTags().subscribe({
      next: (res: any) => this.tags = res,
      error: () => this.toastr.error("Failed to load tags")
    });
  }

  scrollToShop() {
    this.shopSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  view(id: number) {
    this.router.navigate(['/view', id]);
  }
EditItem(id: number) {
  this.router.navigate(['/Dashboard/product', id]);
}
  roles(){
  const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const accessToken: any = this.auth.getAccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  const role = decoded[roleClaim];
  const isAdmin = true; 
   if (role === 'Admin' || role === "Staff") {
    return isAdmin;
  }
return !isAdmin;
}

RemoveItem(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "هل تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء'
  }).then((result) => {
    if (result.isConfirmed ) {
      this.dashboardServices.DeleteProduct(id).subscribe({
        next: (res) => {
          this.toastr.success("Removed SuccessFully");
          if (this.activeTag === null) {
            this.loadProducts();
          } else {
            this.filterByTag(this.activeTag);
          }
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("حدث خطأ أثناء الحذف");
        }
      });
    }
  });
}

  filterByTag(tagId: number | null) {
    this.activeTag = tagId;
    if (this.activeTag === null) this.loadProducts();
    else {
      this.dashboardServices.FilterProductForId(this.activeTag).subscribe({
        next: (res: any) => {
          this.products = res;
          this.resetVisibleProducts();
        }
      });
    }
  }

  resetVisibleProducts() {
    this.visibleProducts = [];
    this.currentIndex = 0;
    this.loadMore();
  }

  loadMore() {
    const nextIndex = this.currentIndex + this.itemsPerPage;
    this.visibleProducts.push(...this.products.slice(this.currentIndex, nextIndex));
    this.currentIndex = nextIndex;
  }


addToCart(product: any) {
  this.cartService.addToCart(this.currentUserId, product.id ?? product.productId, 1)
    .subscribe({
      next: () => this.toastr.success("تمت الإضافة للسلة"),
      error: () => this.toastr.error("حصل خطأ أثناء الإضافة")
    });
}
}
