import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { PaymentDetails, PaymentMethod } from './payment.model';
import { PaymentService } from './payment.service';
import { Cart } from '../shared/models/cart.model';

@Component({
  selector: 'app-payment', standalone: true, imports: [CommonModule, RouterLink],
  templateUrl: './payment.component.html', styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  payment?: PaymentDetails;
  selectedMethod: PaymentMethod = 'UPI';
  processing = false;
  initializing = false;
  error = '';
  readonly methods: { id: PaymentMethod; label: string; icon: string; hint: string }[] = [
    { id: 'UPI', label: 'UPI', icon: '▣', hint: 'Google Pay, PhonePe, Paytm' },
    { id: 'CREDIT_CARD', label: 'Credit Card', icon: '▰', hint: 'Visa, Mastercard, RuPay' },
    { id: 'DEBIT_CARD', label: 'Debit Card', icon: '▰', hint: 'All Indian banks' },
    { id: 'NET_BANKING', label: 'Net Banking', icon: '⌘', hint: 'Pay securely through your bank' },
    { id: 'WALLET', label: 'Wallet', icon: '◉', hint: 'Use your wallet balance' },
    { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '₹', hint: 'Pay when your order arrives' }
  ];

  constructor(private readonly paymentService: PaymentService, private readonly router: Router) {}

  ngOnInit(): void {
    this.payment = this.paymentService.getActive() ?? undefined;
    if (!this.payment) this.initializeFromCheckoutCart();
  }

  private initializeFromCheckoutCart(): void {
    const rawCart = sessionStorage.getItem('shopzy_checkout_cart');
    if (!rawCart) { this.router.navigate(['/buy-now']); return; }
    let cart: Cart;
    try { cart = JSON.parse(rawCart) as Cart; } catch { this.router.navigate(['/cart']); return; }
    if (!cart.items?.length) { this.router.navigate(['/cart']); return; }

    const first = cart.items[0];
    this.initializing = true;
    this.paymentService.initiate({
      product: {
        name: cart.items.length === 1 ? first.productName : `Shopzy order (${cart.items.length} items)`,
        image: first.productImage,
        description: cart.items.map(item => item.productName).join(', '),
        quantity: 1,
        // Dummy payment adds 18% GST; this preserves the checkout grand total.
        unitPrice: Number((cart.totalAmount / 1.18).toFixed(2))
      },
      deliveryAddress: 'Your saved delivery address'
    }).subscribe({
      next: payment => { this.payment = payment; this.initializing = false; },
      error: err => { this.initializing = false; this.error = err.error?.message || 'Unable to start payment for this cart.'; }
    });
  }

  pay(outcome?: 'SUCCESS' | 'FAILED'): void {
    if (!this.payment || this.processing) return;
    this.processing = true; this.error = '';
    // The server owns the decision and performs order/stock changes only on SUCCESS.
    this.paymentService.pay(this.payment.transactionId, this.selectedMethod, outcome).pipe(delay(3000)).subscribe({
      next: payment => {
        this.processing = false;
        this.router.navigate([payment.paymentStatus === 'SUCCESS' ? '/payment-success' : '/payment-failure'], { state: { payment } });
      },
      error: err => { this.processing = false; this.error = err.error?.message || 'We could not process the payment. Please try again.'; }
    });
  }
}
