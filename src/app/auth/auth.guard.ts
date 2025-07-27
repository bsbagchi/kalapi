import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiEngineService } from '../services/api/api-engine.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private apiEngine: ApiEngineService
  ) {}

  canActivate(): boolean {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Check if user is authenticated (this includes token expiry check)
      if (!this.apiEngine.isAuthenticated()) {
        // Clear any stale data and redirect to login
        this.apiEngine.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    return false;
  }
}
