import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../services/api/api-engine.service';

@Component({
  selector: 'app-debug-token',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 class="font-bold">Token Debug Panel</h3>
      <div class="mt-2">
        <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
        <p><strong>Token Remaining Time:</strong> {{ remainingTime }} seconds ({{ remainingMinutes }} minutes)</p>
        <p><strong>Token Expired:</strong> {{ isExpired }}</p>
      </div>
      <div class="mt-3 space-x-2">
        <button 
          (click)="debugToken()" 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Debug Token
        </button>
        <button 
          (click)="testExpiry()" 
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Test Expiry
        </button>
        <button 
          (click)="refreshTimer()" 
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Refresh Timer
        </button>
      </div>
    </div>
  `
})
export class DebugTokenComponent {
  isAuthenticated = false;
  remainingTime = 0;
  remainingMinutes = 0;
  isExpired = false;

  constructor(private apiEngine: ApiEngineService) {
    this.updateTokenInfo();
    
    // Update token info every 10 seconds
    setInterval(() => {
      this.updateTokenInfo();
    }, 10000);
  }

  updateTokenInfo(): void {
    this.isAuthenticated = this.apiEngine.isAuthenticated();
    this.remainingTime = this.apiEngine.getTokenRemainingTime();
    this.remainingMinutes = Math.floor(this.remainingTime / 60);
    this.isExpired = this.apiEngine.isTokenExpired();
  }

  debugToken(): void {
    this.apiEngine.debugTokenStatus();
  }

  testExpiry(): void {
    this.apiEngine.testTokenExpiry();
  }

  refreshTimer(): void {
    this.apiEngine.refreshTokenTimer();
    this.updateTokenInfo();
  }
} 