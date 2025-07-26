import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationConfig } from '../../../../interfaces/pagination.interface';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { PaginationComponent } from "../../../reuse/pagination/pagination.component";
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

@Component({
  selector: 'app-transport-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './transporthome.component.html',
})
export class TransportHomeComponent {
  title = 'Transport';
  transport: any[] = [];
  filteredTransport: any[] = [];
  paginatedTransport: any[] = [];
  filterValue = '';
  errorMessage = '';

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  };

  constructor(private apiEngine: ApiEngineService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAgents();
  }

  fetchAgents(): void {
    this.apiEngine.getAll('/api/Transport').subscribe(
      (data) => {
        this.transport = data;
        this.filteredTransport = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch agents';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch agents!',
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
    this.paginatedTransport = this.filteredTransport.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateAgents();
  }

  filterTransport(): void {
    if (!this.filterValue.trim()) {
      this.filteredTransport = this.transport;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredTransport = this.transport.filter(transport =>
        transport.name.toLowerCase().includes(lower) || transport.remarks.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredTransport);
  }

  editTransport(id: number): void {
    this.router.navigate(['/transport/edit', id]);
  }

  deleteAgent(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this agent?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiEngine.remove('/api/Transport', id).subscribe({
          next: () => {
            this.transport = this.transport.filter(transport => transport.id !== id);
            this.filterTransport();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Agent deleted successfully!',
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete agent!',
            });
          }
        });
      }
    });
  }
}
