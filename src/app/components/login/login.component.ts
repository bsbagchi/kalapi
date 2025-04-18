// login.component.ts
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';  // Adjust the import path as necessary

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService  // Inject LoginService properly
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      this.isLoggedIn = savedLoginStatus === 'true';
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Correct login payload mapping
      const loginPayload = {
        Name: username,  // Mapping 'username' to 'Name' as expected by the API
        Password: password
      };

      // Use the LoginService to make the API call
      this.loginService.login(loginPayload).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          // Save login state
          this.isLoggedIn = true;
          if (this.isBrowser()) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
          }
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          alert('Invalid login credentials. Please try again.');
        }
      });
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    if (this.isBrowser()) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
