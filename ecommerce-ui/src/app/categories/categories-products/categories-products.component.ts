import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApiService } from './product-api.service';
import { categoryConfigs } from './category-config';
import { CategoryConfig, Product, ProductSection, ProductType } from './product-section.model';
import { AuthService } from '../../auth/auth.service';
import { PopupService } from '../../shared/services/popup.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-categories-products',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './categories-products.component.html',
  styleUrl: './categories-products.component.css'
})
export class CategoriesProductsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user$ = this.authService.currentUser$;
  categoryKey = 'mobiles-laptops';
  categoryTitle = 'Products';
  selectedSection = '';
  sections: ProductType[] = [];
  activeSection?: ProductSection;
  cartItems: Record<string, number> = {};
  isLoading = true;
  errorMessage = '';
  cartMessage = '';
  // activePopup: 'login' | null = null;
  // activePopup: PopupType = null;
  loginId = '';
  loginPassword = '';
  authError = '';
  isSubmitting = false;
  private pendingBuyNowProduct?: Product;
  private pendingCartProduct?: Product;
  private categoryConfig?: CategoryConfig;

  constructor(
    private productApi: ProductApiService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private cartService: CartService
  ) { }

ngOnInit(): void {

  this.authService.currentUser$.subscribe(user => {
    if (user && this.pendingCartProduct) {
      const product = this.pendingCartProduct;
      this.pendingCartProduct = undefined;
      this.addToCart(product);
    }
  });

  this.route.paramMap.subscribe(params => {

    this.categoryKey = params.get('categoryName') || 'mobiles-laptops';
    const sectionName = params.get('sectionName');

    this.categoryConfig =
      categoryConfigs[this.categoryKey] ||
      categoryConfigs['mobiles-laptops'];

    this.categoryTitle = this.categoryConfig.title;
    this.sections = this.categoryConfig.types;

    this.route.queryParamMap.subscribe(queryParams => {

      const section = sectionName || queryParams.get('section');

      if (
        section &&
        this.sections.some(s => s.key === section)
      ) {
        this.selectSection(section);
      } else {
        this.selectSection(this.sections[0].key);
      }

    });

  });

}

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     const categoryName = params.get('categoryName') || 'mobiles-laptops';
  //     this.categoryConfig = categoryConfigs[categoryName] || categoryConfigs['mobiles-laptops'];
  //     this.categoryTitle = this.categoryConfig.title;
  //     this.sections = this.categoryConfig.types;
  //     this.selectSection(this.sections[0].key);
  //   });
  // }

  selectSection(sectionKey: string): void {
    const section = this.sections.find((item) => item.key === sectionKey);
    if (!section) {
      return;
    }

    this.selectedSection = sectionKey;
    this.isLoading = true;
    this.errorMessage = '';

    this.productApi.getProducts(section.file).subscribe({
      next: (products: Product[]) => {
        this.activeSection = {
          key: section.key,
          label: section.label,
          products
        };
        this.isLoading = false;
      },
      error: () => {
        this.activeSection = undefined;
        this.errorMessage = 'Unable to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.getCurrentUser()) {
      this.pendingCartProduct = product;
      this.cartMessage = 'Please sign in to add items to your cart.';
      this.popupService.open('login');
      return;
    }

    this.errorMessage = '';
    this.cartMessage = '';
    const productId = this.productId(product);
    this.cartService.addToCart({ productId, productName: product.name, productImage: product.image, price: this.priceAsNumber(product.price), quantity: 1 }).subscribe({
      next: cart => {
        this.cartItems[product.name] = cart.items.find(item => item.productId === productId)?.quantity ?? 1;
        this.cartMessage = 'Product added to cart.';
      },
      error: err => {
        if (err.status === 401 || err.status === 403) {
          this.pendingCartProduct = product;
          this.cartMessage = 'Your session has expired. Please sign in again.';
          this.popupService.open('login');
          return;
        }
        this.errorMessage = err.error?.message || 'We could not add this product to your cart. Please try again.';
      }
    });
  }

  get cartCount(): number {
    return Object.values(this.cartItems).reduce((total, quantity) => total + quantity, 0);
  }


  getProductQuantity(product: Product): number {
    return this.cartItems[product.name] || 0;
  }


  buyNow(product: Product): void {

    if (!this.authService.getCurrentUser()) {

      this.pendingBuyNowProduct = product;

      this.popupService.open('login');

      return;
    }

    this.openBuyNow(product);
  }
  //   buyNow(product: Product): void {
  //     console.log('Buy Now clicked for product:', product);
  //     if (!this.authService.getCurrentUser()) {
  //       console.log('User not logged in. Opening login popup.');
  //     this.popupService.open('login');
  //     return;
  // }
  //     this.authError = 'Please login to continue checkout.';
  //   }

  closePopup(): void {
    this.popupService.close();
    this.authError = '';
  }

  login(): void {
    this.isSubmitting = true;
    this.authError = '';

    this.authService.login({
      usernameOrEmail: this.loginId,
      password: this.loginPassword
    }).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        const buyNowProduct = this.pendingBuyNowProduct;
        const cartProduct = this.pendingCartProduct;

        this.closePopup();

        if (cartProduct) { this.pendingCartProduct = undefined; this.addToCart(cartProduct); }
        if (buyNowProduct) { this.pendingBuyNowProduct = undefined; this.openBuyNow(buyNowProduct); }
      },
      error: () => {
        this.authError = 'Login failed. Please try again.';
      }
    });
  }


  logout(): void {
    this.authService.logoutAndGoHome();
  }

  private openBuyNow(product: Product): void {
    sessionStorage.setItem('shopzy_buy_now_product', JSON.stringify(product));
    this.router.navigate(['/buy-now'], {
      state: { product }
    });
  }
  private priceAsNumber(value: string): number { return Number(value.replace(/[^0-9.]/g, '')) || 0; }
  // Local JSON data has no ID; use a stable fallback until Product Service supplies its numeric ID.
  private productId(product: Product): number { return Array.from(product.name).reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7) || 1; }

}
