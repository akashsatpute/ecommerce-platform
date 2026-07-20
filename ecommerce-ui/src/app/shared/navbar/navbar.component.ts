import { Component } from '@angular/core';
import { AuthUser } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupComponent } from '../../signup/signup.component';
import { LoginComponent } from '../../login/login.component';
import { filter } from 'rxjs';
import { PopupService } from '../services/popup.service';
import { CartService } from '../services/cart.service';
import { MENUS } from './menu.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,LoginComponent,SignupComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  currentUser: AuthUser | null = null;
  activePopup: 'login' | 'signup' | null = null;
  showMenu = true;
  activeMenuIndex: number | null = null;

constructor(
  public authService: AuthService,
  private popupService: PopupService,
  private cartService: CartService,
  private router: Router
) {}

cartCount = 0;
menus = MENUS;
ngOnInit(): void {

  this.authService.currentUser$.subscribe(user => {
    this.currentUser = user;

    if (user) {
      this.closePopup();
      this.cartService.load().subscribe();
    } else {
      this.cartService.setCart(null);
    }
  });

  this.popupService.popup$.subscribe(type => {
    console.log('Navbar popup:', type);   // <-- Add this
    this.activePopup = type;
  });

  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });

}

  closeSubmenu(): void {
    this.activeMenuIndex = null;
  }

  onMenuHover(index: number): void {
    this.activeMenuIndex = index;
  }

  onMenuLeave(): void {
    this.activeMenuIndex = null;
  }

buildSectionRoute(route: string, sectionKey: string): string[] {
  if (!route || route === '/home') {
    return ['/home'];
  }

  const categoryName = route.replace('/category/', '').trim();

  return categoryName ? ['/category', categoryName, sectionKey] : ['/home'];
}
// goToSection(route: string, section: string) {

//   const category = route.split('/').pop();

//   this.router.navigate(
//     ['/category', category],
//     {
//       queryParams: {
//         section: section.toLowerCase()
//       }
//     }
//   );
// }


// ngOnInit(): void {

//   this.authService.currentUser$.subscribe(user => {
//     this.currentUser = user;

//     if (user) {
//       this.popupService.close();
//     }
//   });

//   this.popupService.popup$.subscribe(type => {
//     this.activePopup = type;
//   });

//   this.router.events
//     .pipe(filter(event => event instanceof NavigationEnd))
//     .subscribe(() => {
//       this.showMenu = !this.router.url.startsWith('/category');
//     });

//   // Initial page load
//   this.showMenu = !this.router.url.startsWith('/category');
// }


// openPopup(type: 'login' | 'signup') {
//   this.popupService.open(type);
// }

// closePopup() {
//   this.popupService.close();
// }
openPopup(type: 'login' | 'signup'): void {
  this.popupService.open(type);
}

closePopup(): void {
  this.popupService.close();
}

onSignUpSuccess() {
  this.popupService.close();
}



logout() {
  this.authService.logout();
  this.popupService.close();
}





  // constructor(public authService: AuthService,private router: Router) { } // Inject service

  // ngOnInit(): void {
  //   this.authService.currentUser$.subscribe(user => {
  //     this.currentUser = user;

  //     // Close popup after successful login
  //     if (user) {
  //       this.closePopup();
  //     }
  //   });

  //    this.router.events
  // .pipe(filter(event => event instanceof NavigationEnd))
  // .subscribe(event => {
  //   const navigationEvent = event as NavigationEnd;
  //   this.showMenu = !navigationEvent.urlAfterRedirects.startsWith('/category');
  // });
  // }

  



  // openPopup(type: 'login' | 'signup'): void {
  //   this.activePopup = type;
  // }

  // closePopup(): void {
  //   this.activePopup = null;
  // }

  // onSignUpSuccess() {
  //   this.closePopup();
  //   this.currentUser = null;
  // }

  // logout(): void {
  //   this.authService.logout();
  //   this.closePopup();
  // }
}
