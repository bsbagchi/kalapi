import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiEngineService } from '../../services/api/api-engine.service';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiEngine: ApiEngineService
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

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      // The red borders will appear automatically due to the 'submitted' flag
      return;
    }

    {
      const { username, password } = this.loginForm.value;

      const loginPayload = {
        Name: username,
        Password: password,
      };

      // Debug token status before login
      this.apiEngine.debugTokenStatus();

      this.apiEngine.login(loginPayload).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.isLoggedIn = true;
          if (this.isBrowser()) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userId', res.userId || '');
          }

          // Debug token status after login
          this.apiEngine.debugTokenStatus();

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome back, ${username}!`,
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid login credentials. Please try again.',
          });
        },
      });
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    // Use ApiEngineService for proper logout with token cleanup
    this.apiEngine.logout();
    Swal.fire({
      icon: 'info',
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
