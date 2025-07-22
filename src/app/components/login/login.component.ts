import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isRegistering: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister(): Promise<void> {
    if (!this.validateCredentials()) return;

    this.isRegistering = true;
    this.errorMessage = '';

    try {
      await this.authService.register(this.username, this.password);
      // Auto-login after successful registration
      this.authService.login(this.username, this.password);
      this.router.navigate(['/rooms']);
    } catch (error) {
      console.error('Registration error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isRegistering = false;
    }
  }
  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    try {
      this.authService.login(this.username, this.password);
      this.router.navigate(['/rooms']);
    } catch (error) {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error('Login error:', error);
    }
  }
  private validateCredentials(): boolean {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return false;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }
    return true;
  }

  private getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Username already exists';
    }
    if (error.status === 400) {
      return 'Invalid username or password format';
    }
    return 'Registration failed. Please try again.';
  }

  // ... keep existing onLogin() implementation ...
}