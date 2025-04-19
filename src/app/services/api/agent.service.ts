// agent.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://www.kalapiprint.somee.com/api/Agent';

  constructor(private http: HttpClient) {}

  getAgents() {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteAgent(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateAgent(id: number, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  getAgentById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
