import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiEngineService } from './api/api-engine.service';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenMonitorService implements OnDestroy {
  private tokenCheckInterval: Subscription | null = null;
  private readonly CHECK_INTERVAL = 30000; // Check every 30 seconds

  constructor(
    private apiEngine: ApiEngineService,
    private router: Router
  ) {
    this.startTokenMonitoring();
  }

  /**
   * Start monitoring token expiry
   */
  private startTokenMonitoring(): void {
    // Check immediately
    this.checkTokenExpiry();

    // Set up periodic checking
    this.tokenCheckInterval = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkTokenExpiry();
    });
  }

  /**
   * Check if token is expired and handle logout if needed
   */
  private checkTokenExpiry(): void {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn && !this.apiEngine.isAuthenticated()) {
        console.log('Token expired, logging out user automatically');
        this.apiEngine.logout();
        
        // Only redirect if not already on login page
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    }
  }

  /**
   * Stop monitoring (called when service is destroyed)
   */
  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
    }
  }

  /**
   * Manually trigger token check
   */
  public checkTokenNow(): void {
    this.checkTokenExpiry();
  }
} 