import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'https://textileerp-001-site1.stempurl.com/api/Agent';

  constructor(private http: HttpClient) {}


  /**
 * Create a new agent
 */
createAgent(payload: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, payload);
}

  /**
   * Get all agents
   */
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Get a single agent by ID
   */
  getAgentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete an agent by ID
   */
  deleteAgent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update an agent by ID
   */
  updateAgent(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }
}
