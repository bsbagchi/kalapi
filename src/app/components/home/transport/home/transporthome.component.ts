import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import this
import { PaginationConfig } from '../../../../interfaces/pagination.interface';
import { TransportService } from '../../../../services/api/transport.service';
import { PaginationComponent } from "../../../reuse/pagination/pagination.component";

@Component({
  selector: 'app-transport-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // ✅ Add this here
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

  constructor(private TransportService: TransportService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAgents();
  }

  fetchAgents(): void {
    this.TransportService.getTransport().subscribe(
      (data) => {
        this.transport = data;
        this.filteredTransport = data;
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
    if (confirm('Are you sure you want to delete this agent?')) {
      this.TransportService.deleteTransport(id).subscribe({
        next: () => {
          this.transport = this.transport.filter(transport => transport.id !== id);
          this.filterTransport();  // reapply filter after delete
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
