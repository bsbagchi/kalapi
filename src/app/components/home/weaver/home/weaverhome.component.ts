import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeaverService } from '../../../../services/api/weaver.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';  // 👈 Import
import { PaginationConfig } from '../../../../interfaces/pagination.interface';  // 👈 Import

@Component({
  selector: 'app-weaver-home',
  standalone: true,
  templateUrl: './weaverhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class WeaverHomeComponent implements OnInit {
  title = 'Weaver Management';
  agents: any[] = [];
  filteredAgents: any[] = [];
  paginatedAgents: any[] = [];
  filterValue = '';
  errorMessage = '';

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  };

  constructor(private WeaverServce: WeaverService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAgents();
  }

  fetchAgents(): void {
    this.WeaverServce.getAgents().subscribe(
      (data) => {
        this.agents = data;
        this.filteredAgents = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch agents';
        console.error(error);
      }
    );
  }

  setupPagination(data: any[]): void {
    this.paginationConfig.totalItems = data.length;
    this.paginationConfig.totalPages = Math.ceil(data.length / this.paginationConfig.itemsPerPage);
    this.paginateAgents();
  }

  paginateAgents(): void {
    const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemsPerPage;
    const end = start + this.paginationConfig.itemsPerPage;
    this.paginatedAgents = this.filteredAgents.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateAgents();
  }

  filterAgents(): void {
    if (!this.filterValue.trim()) {
      this.filteredAgents = this.agents;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredAgents = this.agents.filter(agent =>
        agent.name.toLowerCase().includes(lower) || agent.remarks.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredAgents);
  }

  editAgent(id: number): void {
    this.router.navigate(['/agent/edit', id]);
  }

  deleteAgent(id: number): void {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.WeaverServce.deleteAgent(id).subscribe({
        next: () => {
          this.agents = this.agents.filter(agent => agent.id !== id);
          this.filterAgents();  // reapply filter after delete
          alert('Agent deleted successfully!');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete agent!');
        }
      });
    }
  }
}
