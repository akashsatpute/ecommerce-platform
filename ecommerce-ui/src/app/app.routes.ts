import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoriesProductsComponent } from './categories/categories-products/categories-products.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { BuyOutComponent } from './buy-out/buy-out.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment/payment-success.component';
import { PaymentFailureComponent } from './payment/payment-failure.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'category/:categoryName/:sectionName', component: CategoriesProductsComponent },
    { path: 'category/:categoryName', component: CategoriesProductsComponent },
    { path: 'buy-now', component: BuyOutComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'payment-success', component: PaymentSuccessComponent },
    { path: 'payment-failure', component: PaymentFailureComponent },
    { path: 'order-success', component: PaymentSuccessComponent },
    { path: 'login-success', component: LoginSuccessComponent },
    { path: '**', redirectTo: 'home' }
];
