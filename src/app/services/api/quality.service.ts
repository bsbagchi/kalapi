import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityService {
  private apiUrl = 'http://www.kalapiprint.somee.com/api/ClothQuality';

  constructor(private http: HttpClient) {}

  /**
   * Get all agents
   */
  getQuality(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Get a single agent by ID
   */
  getQualityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete an agent by ID
   */
  deleteQuality(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update an agent by ID
   */
  updateQuality(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }
}
