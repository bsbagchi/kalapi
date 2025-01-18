import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if the code is running in the browser before accessing localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        return true;
      }
    }

    // Redirect to login page if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}
