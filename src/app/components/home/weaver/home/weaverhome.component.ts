import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';
import { PaginationConfig } from '../../../../interfaces/pagination.interface';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

@Component({
  selector: 'app-process-home',
  standalone: true,
  templateUrl: './weaverhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class WeaverHomeComponent implements OnInit {
  title = 'Weaver Management';
  weaver: any[] = [];
  filteredWeaver: any[] = [];
  paginatedWeaver: any[] = [];
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
    this.fetchWeaver();
  }

  fetchWeaver(): void {
    this.apiEngine.getAll('/api/Weaver').subscribe(
      (data) => {
        this.weaver = data;
        this.filteredWeaver = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch Weaver';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch weavers!',
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
    this.paginatedWeaver = this.filteredWeaver.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateAgents();
  }

  filterWeaver(): void {
    if (!this.filterValue.trim()) {
      this.filteredWeaver = this.weaver;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredWeaver = this.weaver.filter(weaver =>
        weaver.name.toLowerCase().includes(lower) || weaver.remarks.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredWeaver);
  }

  editWeaver(id: number): void {
    this.router.navigate(['/weaver/edit', id]);
  }

  deleteWeaver(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiEngine.remove('/api/Weaver', id).subscribe({
          next: () => {
            this.weaver = this.weaver.filter(weaver => weaver.id !== id);
            this.filterWeaver();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Weaver deleted successfully.',
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete the weaver.',
            });
          }
        });
      }
    });
  }
}
