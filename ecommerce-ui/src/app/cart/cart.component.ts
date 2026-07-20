import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '../shared/models/cart.model';
import { CartService } from '../shared/services/cart.service';
@Component({ selector: 'app-cart', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './cart.component.html', styleUrl: './cart.component.css' })
export class CartComponent implements OnInit {
  cart: Cart | null = null; loading = true; error = '';
  constructor(private readonly cartService: CartService, private readonly router: Router) {}
  ngOnInit(): void { this.cartService.cart$.subscribe(cart => this.cart = cart); this.cartService.load().subscribe({ next: () => this.loading = false, error: () => { this.loading = false; this.error = 'Unable to load your cart.'; } }); }
  change(itemId: number, quantity: number): void { if (quantity < 1) return this.remove(itemId); this.cartService.updateQuantity(itemId, quantity).subscribe({ error: () => this.error = 'Unable to update quantity.' }); }
  remove(itemId: number): void { this.cartService.remove(itemId).subscribe({ error: () => this.error = 'Unable to remove this item.' }); }
  clear(): void { this.cartService.clear().subscribe({ error: () => this.error = 'Unable to clear your cart.' }); }
  checkout(): void { this.cartService.checkout().subscribe({ next: cart => this.router.navigate(['/checkout'], { state: { cart } }), error: err => this.error = err.error?.message || 'Your cart cannot be checked out.' }); }
}
