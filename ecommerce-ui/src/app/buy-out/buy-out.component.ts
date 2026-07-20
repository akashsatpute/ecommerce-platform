import { Component } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../categories/categories-products/product-section.model';
import { PaymentService } from '../payment/payment.service';

@Component({
  selector: 'app-buy-out',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './buy-out.component.html',
  styleUrl: './buy-out.component.css'
})
export class BuyOutComponent {
  product?: Product;
  isStartingPayment = false;
  error = '';
  quantity = 1;
  isWishlisted = false;
  couponApplied = false;
  readonly offers = ['10% instant discount with selected bank cards', 'Extra ₹150 off on your first Shopzy order', 'No-cost EMI available on orders above ₹3,000'];

  constructor(private readonly router: Router, private readonly paymentService: PaymentService) {
    const stateProduct = history.state?.product as Product | undefined;

    if (stateProduct?.name) {
      this.product = stateProduct;
      return;
    }

    const storedProduct = sessionStorage.getItem('shopzy_buy_now_product');

    if (storedProduct) {
      this.product = JSON.parse(storedProduct);
    }
  }

  placeOrder(): void {
    if (!this.product || this.isStartingPayment) return;
    this.isStartingPayment = true; this.error = '';
    this.paymentService.initiate({
      product: { name: this.product.name, image: this.product.image, description: this.product.description, quantity: this.quantity, unitPrice: this.unitPrice },
      deliveryAddress: 'Your saved delivery address'
    }).subscribe({
      next: () => this.router.navigate(['/payment']),
      error: err => { this.isStartingPayment = false; this.error = err.error?.message || 'Unable to start secure payment. Please try again.'; }
    });
  }

  private priceAsNumber(value: string): number { return Number(value.replace(/[^0-9.]/g, '')) || 0; }
  get unitPrice(): number { return this.product ? this.priceAsNumber(this.product.price) : 0; }
  get subtotal(): number { return this.unitPrice * this.quantity; }
  get discountAmount(): number { return this.product ? Math.max(0, this.priceAsNumber(this.product.mrp) - this.unitPrice) * this.quantity : 0; }
  get couponDiscount(): number { return this.couponApplied ? Math.min(150, this.subtotal) : 0; }
  get gst(): number { return Number(((this.subtotal - this.couponDiscount) * .18).toFixed(2)); }
  get total(): number { return this.subtotal - this.couponDiscount + this.gst; }
  changeQuantity(delta: number): void { this.quantity = Math.max(1, Math.min(10, this.quantity + delta)); }
  applyCoupon(): void { this.couponApplied = !this.couponApplied; }

}
