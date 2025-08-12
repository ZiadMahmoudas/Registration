import { HttpClient } from "@angular/common/http";
import { TokenServices } from "../browser/TokenServices";
import { BehaviorSubject, switchMap, tap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "../../token/token";

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly baseURL: string = inject(API_URL);

  private currentUserId: number | null = null;

  private wishlistItemsSubject = new BehaviorSubject<any[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();



  constructor(private http: HttpClient, private storage: TokenServices) {}

  setCurrentUserId(userId: number) {
    this.currentUserId = userId;
  }

  fetchAndStoreWishlist(userId: number) {
    this.setCurrentUserId(userId);
    return this.http.get<any[]>(`${this.baseURL}WishList/${userId}`).pipe(
      tap(items => {
        this.saveWishlistItems(items);
        this.wishlistItemsSubject.next(items);
      })
    );
  }

  addToWishlist(payload: { userId: number, product: { productId: number } }) {
    return this.http.post<any>(`${this.baseURL}WishList/add`, payload).pipe(
      switchMap(() => {
        if (!this.currentUserId) throw new Error("UserId not set");
        return this.fetchAndStoreWishlist(this.currentUserId);
      })
    );
  }

  removeFromWishlist(wishlistId: number) {
    return this.http.delete(`${this.baseURL}WishList/${wishlistId}`).pipe(
      switchMap(() => {
        if (!this.currentUserId) throw new Error("UserId not set");
        return this.fetchAndStoreWishlist(this.currentUserId);
      })
    );
  }

  private saveWishlistItems(items: any[]) {
  const ids = items.map(item => item.wishListId ?? item.wishlistId);
  this.storage.set('WishList', JSON.stringify(ids));
  this.wishlistItemsSubject.next(ids);
  }

getWishlistItemsFromStorage(): number[] {
  const saved = this.storage.get('WishList');
  if (saved) {
    try {
      return JSON.parse(saved) as number[];
    } catch (e) {
      console.error("Invalid wishlist data in localStorage", e);
    }
  }
  return [];
}

loadWishlistFromStorage() {
  const ids = this.getWishlistItemsFromStorage();
  this.wishlistItemsSubject.next(ids);
}
  clearWishlist() {
    this.storage.remove('WishList');
    this.wishlistItemsSubject.next([]);
  }


}
