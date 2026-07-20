import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '../shared/models/cart.model';
import { CartService } from '../shared/services/cart.service';
@Component({ selector: 'app-checkout', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './checkout.component.html', styleUrl: './checkout.component.css' })
export class CheckoutComponent implements OnInit { cart?: Cart; constructor(private readonly carts: CartService, private readonly router: Router) {} ngOnInit(): void { this.cart = history.state?.cart; if (!this.cart) this.carts.load().subscribe(cart => { this.cart = cart ?? undefined; if (!cart?.items.length) this.router.navigate(['/cart']); }); } pay(): void { sessionStorage.setItem('shopzy_checkout_cart', JSON.stringify(this.cart)); this.router.navigate(['/payment']); } }
