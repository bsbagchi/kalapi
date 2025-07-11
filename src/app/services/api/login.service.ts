// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://textileerp-001-site1.stempurl.com/api/Auth/login';  

  constructor(private http: HttpClient) {}

  login(payload: { Name: string, Password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
