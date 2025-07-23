// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_KEY } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://textileerp-001-site1.stempurl.com/api/Auth/login';  

  constructor(private http: HttpClient) {}

  login(payload: { Name: string, Password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(this.apiUrl, payload).subscribe({
        next: (response) => {
          if (response && response.accessToken) {
            localStorage.setItem(TOKEN_KEY, response.accessToken);
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
}
