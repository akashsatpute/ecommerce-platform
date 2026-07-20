import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login-success.component.html',
  styleUrl: './login-success.component.css'
})
export class LoginSuccessComponent {
  message = 'Signing you in...';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    const token =
      this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.errorMessage = 'Google login did not return a token.';
      this.router.navigate(['/login']);
      return;

    }

    this.authService.completeOAuthLogin(token).subscribe({
      next: user => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.authService.logout();
        this.message = '';
        this.errorMessage = 'Login succeeded, but your profile could not be loaded.';
        this.router.navigate(['/login']);
      }

    });

  }

}
