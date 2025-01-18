import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  title = 'kalapi';
  loginForm: FormGroup;
  isLoggedIn = false;

  private defaultUsername = 'admin';
  private defaultPassword = 'password123';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false], // Add rememberMe control with a default value
    });
  }

  ngOnInit(): void {
    // Ensure this code runs only in the browser
    if (this.isBrowser()) {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      this.isLoggedIn = savedLoginStatus === 'true';
    }
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    if (username === this.defaultUsername && password === this.defaultPassword) {
      this.isLoggedIn = true;

      // Save login state to localStorage only in the browser
      if (this.isBrowser()) {
        localStorage.setItem('isLoggedIn', 'true');
      }

      this.router.navigate(['/']);
    } else {
      alert('Invalid login credentials. Please try again.');
    }
  }

  logout(): void {
    this.isLoggedIn = false;

    // Remove login state from localStorage only in the browser
    if (this.isBrowser()) {
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Utility function to check if the code is running in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
