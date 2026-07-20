import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaymentDetails } from './payment.model';
import { PaymentService } from './payment.service';

@Component({ selector: 'app-payment-success', standalone: true, imports: [CommonModule, RouterLink, DatePipe], templateUrl: './payment-success.component.html', styleUrl: './payment-result.component.css' })
export class PaymentSuccessComponent implements OnInit {
  payment?: PaymentDetails;
  constructor(private readonly paymentService: PaymentService, private readonly router: Router) {}
  ngOnInit(): void { this.payment = history.state?.payment ?? this.paymentService.getActive() ?? undefined; if (!this.payment || this.payment.paymentStatus !== 'SUCCESS') this.router.navigate(['/buy-now']); }
  continueShopping(): void { this.paymentService.clear(); sessionStorage.removeItem('shopzy_buy_now_product'); this.router.navigate(['/home']); }
}
