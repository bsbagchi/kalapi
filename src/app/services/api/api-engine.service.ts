import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_BASE_URL, TOKEN_KEY } from './api.config';

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

  constructor(private http: HttpClient) {}

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
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
            if (response.expireIn) {
              setTimeout(() => {
                this.clearExpiredToken();
                console.log('Token expired automatically');
              }, response.expireIn * 1000);
            }
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
   * Logout operation
   */
  logout(): void {
    this.clearExpiredToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? !this.isTokenExpired() : false;
  }
} 