// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://www.kalapiprint.somee.com/api/Auth/login';  // Replace with your actual login API endpoint

  constructor(private http: HttpClient) {}

  login(payload: { Name: string, Password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
