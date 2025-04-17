import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://www.kalapiprint.somee.com/api/Auth/login';

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ name, password });

    return this.http.post(this.apiUrl, body, { headers });
  }
}
