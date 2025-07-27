import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// API Configuration
const API_BASE_URL = 'https://textileerp-001-site1.stempurl.com';
const TOKEN_KEY = 'accessToken';

export interface ApiEndpoint {
  name: string;
  path: string;
  requiresAuth?: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  error?: any;
}

export interface LoginResponse {
  accessToken: string;
  expireIn: number;
  name: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiEngineService {
  private baseUrl = API_BASE_URL;
  private tokenExpiryTimer: any;

  constructor(private http: HttpClient) {
    // Initialize token expiry timer for existing sessions
    this.initializeTokenExpiryTimer();
  }

  /**
   * Initialize token expiry timer for existing sessions
   */
  private initializeTokenExpiryTimer(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !this.isTokenExpired()) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const timeRemaining = payload.exp - currentTime;
          
          if (timeRemaining > 0) {
            this.setupTokenExpiryTimer(timeRemaining);
          } else {
            // Token is expired, clear it
            this.clearExpiredToken();
          }
        }
      } catch (error) {
        console.error('Error initializing token expiry timer:', error);
        this.clearExpiredToken();
      }
    }
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('No token found in localStorage');
      return true;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format (not a JWT)');
        return true;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
   
      
      return isExpired;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Clear expired token
   */
  private clearExpiredToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  /**
   * Get authentication headers
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(TOKEN_KEY);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token && !this.isTokenExpired()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else if (this.isTokenExpired()) {
      this.clearExpiredToken();
    }
    
    return headers;
  }

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, params?: Record<string, string | number>): Observable<T> {
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<T>(url, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.clearExpiredToken();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, payload: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(url, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.clearExpiredToken();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, payload: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.clearExpiredToken();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.clearExpiredToken();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic PATCH request
   */
  patch<T>(endpoint: string, payload: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.patch<T>(url, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.clearExpiredToken();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * CRUD operations for any entity
   */
  create<T>(entityPath: string, payload: any): Observable<T> {
    return this.post<T>(entityPath, payload);
  }

  getAll<T>(entityPath: string, params?: Record<string, string | number>): Observable<T[]> {
    return this.get<T[]>(entityPath, params);
  }

  getById<T>(entityPath: string, id: number | string): Observable<T> {
    return this.get<T>(`${entityPath}/${id}`);
  }

  update<T>(entityPath: string, id: number | string, payload: any): Observable<T> {
    return this.put<T>(`${entityPath}/${id}`, payload);
  }

  remove<T>(entityPath: string, id: number | string): Observable<T> {
    return this.delete<T>(`${entityPath}/${id}`);
  }

  /**
   * Login operation with token expiration handling
   */
  login(payload: { Name: string, Password: string }): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>('https://textileerp-001-site1.stempurl.com/api/Auth/login', payload).subscribe({
        next: (response) => {
          if (response && response.accessToken) {
            localStorage.setItem(TOKEN_KEY, response.accessToken);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', response.name);
            
            // Set up token expiration timer
            this.setupTokenExpiryTimer(response.expireIn);
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Setup token expiry timer
   */
  private setupTokenExpiryTimer(expireIn: number): void {
    if (expireIn && expireIn > 0) {
      // Clear any existing timer
      if (this.tokenExpiryTimer) {
        clearTimeout(this.tokenExpiryTimer);
      }
      
      // Set new timer
      this.tokenExpiryTimer = setTimeout(() => {
        console.log('Token expired automatically');
        this.clearExpiredToken();
        // Redirect to login if not already there
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, expireIn * 1000);
    }
  }

  /**
   * Refresh token expiry timer (useful for keeping session alive)
   */
  public refreshTokenTimer(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const timeRemaining = payload.exp - currentTime;
          
          if (timeRemaining > 0) {
            this.setupTokenExpiryTimer(timeRemaining);
          }
        }
      } catch (error) {
        console.error('Error refreshing token timer:', error);
      }
    }
  }

  /**
   * Logout operation
   */
  logout(): void {
    // Clear token expiry timer
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }
    this.clearExpiredToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? !this.isTokenExpired() : false;
  }

  /**
   * Debug method to check token status
   */
  debugTokenStatus(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('=== Token Debug Info ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);
    console.log('Is expired:', this.isTokenExpired());
    console.log('Is authenticated:', this.isAuthenticated());
    console.log('Token expiry timer active:', !!this.tokenExpiryTimer);
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const timeRemaining = payload.exp - currentTime;
          console.log('Token payload:', payload);
          console.log('Time remaining (seconds):', timeRemaining);
          console.log('Time remaining (minutes):', Math.floor(timeRemaining / 60));
        }
      } catch (error) {
        console.error('Error parsing token for debug:', error);
      }
    }
    console.log('========================');
  }

  /**
   * Test method to simulate token expiry (for testing purposes)
   */
  testTokenExpiry(): void {
    console.log('Testing token expiry...');
    this.clearExpiredToken();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Get remaining token time in seconds
   */
  getTokenRemainingTime(): number {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          return Math.max(0, payload.exp - currentTime);
        }
      } catch (error) {
        console.error('Error getting token remaining time:', error);
      }
    }
    return 0;
  }
} 