import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeaverService {
  private apiUrl = 'http://www.kalapiprint.somee.com/api/Weaver'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  createWeaver(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  /**
   * Get all Weaver
   */
  getWeaver(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Get a single agent by ID
   */
  getWeaverById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete an agent by ID
   */
  deleteWeaver(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update an agent by ID
   */
  updateWeaver(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }
}
