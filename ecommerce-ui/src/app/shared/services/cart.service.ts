import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { AddToCartRequest, Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Cart Service runs directly on 8085 in local development. In production this path is served by API Gateway.
  private readonly apiUrl = 'http://localhost:8085/api/cart';
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  cartCount$ = this.cartCountSubject.asObservable();
  cart$ = this.cartSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  load(): Observable<Cart | null> {
    return this.http.get<Cart>(this.apiUrl).pipe(tap(cart => this.setCart(cart)), catchError(() => of(null)));
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, request).pipe(tap(cart => this.setCart(cart)));
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update/${itemId}`, { quantity }).pipe(tap(cart => this.setCart(cart)));
  }

  remove(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${itemId}`).pipe(tap(cart => this.setCart(cart)));
  }

  clear(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(tap(() => this.setCart(null)));
  }

  checkout(): Observable<Cart> { return this.http.post<Cart>(`${this.apiUrl}/checkout`, {}).pipe(tap(cart => this.setCart(cart))); }

  setCart(cart: Cart | null): void {
    this.cartSubject.next(cart);
    this.cartCountSubject.next(cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0);
  }

getCartCount(): number {
  return this.cartCountSubject.value;
}
}
