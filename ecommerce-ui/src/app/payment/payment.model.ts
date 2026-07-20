export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentProduct {
  name: string;
  image: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface PaymentInitiateRequest {
  product: PaymentProduct;
  deliveryAddress: string;
}

export interface PaymentPayRequest {
  transactionId: string;
  paymentMethod: PaymentMethod;
  testOutcome?: 'SUCCESS' | 'FAILED';
}

export interface PaymentDetails {
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  customerName: string;
  deliveryAddress: string;
  product: PaymentProduct;
  subtotal: number;
  delivery: number;
  discount: number;
  gst: number;
  totalAmount: number;
  gatewayName?: string;
  failureReason?: string;
}
