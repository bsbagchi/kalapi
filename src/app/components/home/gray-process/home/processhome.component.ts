import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/api/agent.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';  // 👈 Import
import { PaginationConfig } from '../../../../interfaces/pagination.interface';  // 👈 Import
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gray-process-home',
  standalone: true,
  templateUrl: './processhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class GrayProcessHomeComponent implements OnInit {
  title = 'Gray Process Management';
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

  constructor(private AgentService: AgentService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAgents();
  }

  fetchAgents(): void {
    this.AgentService.getAgents().subscribe(
      (data) => {
        this.agents = data;
        this.filteredAgents = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch agents';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch agent details!',
          confirmButtonText: 'OK',
        });

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
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to delete this agent?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AgentService.deleteAgent(id).subscribe({
          next: () => {
            this.agents = this.agents.filter(agent => agent.id !== id);
            this.filterAgents();  // reapply filter after delete
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Agent deleted successfully!',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete agent!',
              confirmButtonText: 'Try Again'
            });
          }
        });
      }
    });
  }
}
