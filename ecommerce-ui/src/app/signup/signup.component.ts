import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { SignupRequest } from '../auth/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgIf,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  
  firstName = '';
  lastName = '';
  email = '';
  username = '';
  password = '';

  isSubmitting = false;

  authMessage = '';
  authError = '';
  @Output() signUpSuccess = new EventEmitter<void>();
  

  constructor(
    private authService: AuthService
  ) {}

  signup(): void {

    this.authMessage = '';
    this.authError = '';

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.username.trim() ||
      !this.password
    ) {
      this.authError = 'All fields are required.';
      return;
    }

    const payload: SignupRequest = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      username: this.username.trim(),
      password: this.password
    };

    this.isSubmitting = true;

    this.authService.signup(payload).subscribe({

      next: (response) => {

        console.log('Signup successful:', response);

        this.authMessage =
          response.message || 'Account created successfully.';

        this.authError = '';

        this.isSubmitting = false;
        this.signUpSuccess.emit();


        this.clearForm();
      },

      error: (error) => {

        console.error('Signup error:', error);

        this.authMessage = '';

        this.authError =
          error.error?.message ||
          error.error ||
          error.message ||
          'Account creation failed.';

        this.isSubmitting = false;
      }

    });

  }

  oauthLogin(provider: string): void {

    if (provider === 'google' || provider === 'github') {
      this.authService.loginWithOAuth(provider);
    }

  }

  

  private clearForm(): void {

    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.username = '';
    this.password = '';

  }
}
