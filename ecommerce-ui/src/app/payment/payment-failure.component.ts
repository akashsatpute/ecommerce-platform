import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaymentDetails } from './payment.model';
import { PaymentService } from './payment.service';

@Component({ selector: 'app-payment-failure', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './payment-failure.component.html', styleUrl: './payment-result.component.css' })
export class PaymentFailureComponent implements OnInit {
  payment?: PaymentDetails;
  constructor(private readonly paymentService: PaymentService, private readonly router: Router) {}
  ngOnInit(): void { this.payment = history.state?.payment ?? this.paymentService.getActive() ?? undefined; if (!this.payment || this.payment.paymentStatus !== 'FAILED') this.router.navigate(['/buy-now']); }
  retry(): void { this.router.navigate(['/payment']); }
  cancel(): void { this.paymentService.clear(); this.router.navigate(['/buy-now']); }
}
