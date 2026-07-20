import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PaymentDetails, PaymentInitiateRequest, PaymentMethod, PaymentPayRequest } from './payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = 'http://localhost:8080/api/payment';
  private readonly paymentKey = 'shopzy_active_payment';

  constructor(private readonly http: HttpClient) {}

  initiate(request: PaymentInitiateRequest): Observable<PaymentDetails> {
    return this.http.post<PaymentDetails>(`${this.apiUrl}/initiate`, request).pipe(tap(payment => this.save(payment)));
  }

  pay(transactionId: string, paymentMethod: PaymentMethod, testOutcome?: 'SUCCESS' | 'FAILED'): Observable<PaymentDetails> {
    const request: PaymentPayRequest = { transactionId, paymentMethod, testOutcome };
    return this.http.post<PaymentDetails>(`${this.apiUrl}/pay`, request).pipe(tap(payment => this.save(payment)));
  }

  getByTransactionId(transactionId: string): Observable<PaymentDetails> {
    return this.http.get<PaymentDetails>(`${this.apiUrl}/${encodeURIComponent(transactionId)}`).pipe(tap(payment => this.save(payment)));
  }

  getActive(): PaymentDetails | null {
    const raw = sessionStorage.getItem(this.paymentKey);
    if (!raw) return null;
    try { return JSON.parse(raw) as PaymentDetails; } catch { return null; }
  }

  save(payment: PaymentDetails): void { sessionStorage.setItem(this.paymentKey, JSON.stringify(payment)); }
  clear(): void { sessionStorage.removeItem(this.paymentKey); }
}
