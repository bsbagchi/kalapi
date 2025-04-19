import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/api/agent.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-agent-home',
  standalone: true,
  templateUrl: './agenthome.component.html',
  imports: [CommonModule, RouterModule],
})
export class AgentHomeComponent implements OnInit {
  title = 'Agent Management';
  agents: any[] = [];
  errorMessage: string = '';

  constructor(private AgentService: AgentService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAgents();
  }

  fetchAgents(): void {
    this.AgentService.getAgents().subscribe(
      (data) => {
        this.agents = data;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch agents';
        console.error(error);
      }
    );
  }

  deleteAgent(id: number): void {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.AgentService.deleteAgent(id).subscribe({
        next: () => {
          this.agents = this.agents.filter(agent => agent.id !== id);
          alert('Agent deleted successfully!');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete agent!');
        }
      });
    }
  }

  editAgent(id: number): void {
    this.router.navigate(['/agent/edit', id]);
  }
}
