import { CartItem } from './cart-item.model';
export interface Cart { id: number; status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED'; totalAmount: number; items: CartItem[]; createdDate?: string; updatedDate?: string; }
export interface AddToCartRequest { productId: number; productName: string; productImage: string; price: number; quantity: number; }
