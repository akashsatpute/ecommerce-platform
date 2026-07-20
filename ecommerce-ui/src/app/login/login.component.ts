import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../auth/auth.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginId = '';
  loginPassword = '';

  isSubmitting = false;
  @Output() loginSuccess = new EventEmitter<void>();


  authMessage = '';
  authError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.authMessage = '';
    this.authError = '';

    if (!this.loginId.trim() || !this.loginPassword) {
      this.authError = 'Username or email and password are required.';
      return;
    }

    const payload: LoginRequest = {
      usernameOrEmail: this.loginId.trim(),
      password: this.loginPassword
    };

    this.isSubmitting = true;

    this.authService.login(payload).subscribe({

      next: (session) => {

        console.log('Login successful:', session);

        this.authMessage =
          session.message || 'Login successful.';

        this.isSubmitting = false;

        console.log('JWT Token:', session.token);
        console.log('Logged In User:', session.user);
        this.loginSuccess.emit();

        this.router.navigate(['/home']);

      },

      error: (error) => {

        console.error('Login error:', error);

        this.isSubmitting = false;

        this.authError =
          error.error?.message ||
          error.message ||
          'Invalid username or password.';

      }

    });

  }

  oauthLogin(provider: string): void {

    if (provider === 'google' || provider === 'github') {

      this.authService.loginWithOAuth(provider);

    }

  }
}
