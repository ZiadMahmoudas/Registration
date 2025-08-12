import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../token/token';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseURL: string = inject(API_URL);

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

loadCart(userId: number) {
  return this.http.get<any[]>(`${this.baseURL}Cart/${userId}`)
    .pipe(
      tap(items => {
        this.cartSubject.next(items);
      })
    );
}

addToCart(userId: number, productId: number, quantity: number) {
  const dto = { userId,productId:  productId  ,  quantity};
  return this.http.post<any>(`${this.baseURL}Cart/add`, dto).pipe(
    tap((addedItem) => {
      const currentCart = this.cartSubject.getValue();
      const index = currentCart.findIndex(item => item.cartId === addedItem.cartId);
      if (index !== -1) {
        currentCart[index].quantity += quantity;
      } else {
        currentCart.push(addedItem);
      }
      this.cartSubject.next([...currentCart]);
    })
  );
}

removeFromCart(cartId: number) {
  return this.http.delete<any>(`${this.baseURL}Cart/${cartId}`).pipe(
    tap((updatedItem) => {
      const currentCart = this.cartSubject.getValue();
      const index = currentCart.findIndex(item => item.cartId === cartId);
      if (index === -1) return;
      if (updatedItem && typeof updatedItem.quantity === 'number') {
        if (updatedItem.quantity > 0) {
          currentCart[index].quantity = updatedItem.quantity;
        } else {
          currentCart.splice(index, 1);
        }
      } 
      else {
        currentCart[index].quantity -= 1;
        if (currentCart[index].quantity <= 0) {
          currentCart.splice(index, 1);
        }
      }

      this.cartSubject.next([...currentCart]);
    })
  );
  
}
totalPrice$ = this.cart$.pipe(
  map(items => items.reduce((total, item) => total + (item.salary * item.quantity), 0))
);
getCartItemCount() {
  return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
}
cartCount$ = this.cart$.pipe(
  map(items => items.reduce((total, item) => total + item.quantity, 0))
);
loadCartFromServer(userId: number) {
  return this.http.get<any[]>(`${this.baseURL}Cart/${userId}`).pipe(
    tap(cartItems => {
      this.cartSubject.next(cartItems);
    })
  );
}
clearCartLocal() {
  this.cartSubject.next([]);
}

}
