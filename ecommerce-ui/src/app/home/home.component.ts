import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/auth.model';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  

  
}
