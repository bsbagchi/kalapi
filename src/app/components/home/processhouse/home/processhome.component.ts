import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';  // 👈 Import
import { PaginationConfig } from '../../../../interfaces/pagination.interface';  // 👈 Import
import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-home',
  standalone: true,
  templateUrl: './processhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class ProcessHomeComponent implements OnInit {
  title = 'Process House';
  process: any[] = [];
  filteredProcess: any[] = [];
  paginatedProcess: any[] = [];
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
    this.fetchProcess();
  }

  fetchProcess(): void {
    this.apiEngine.getAll('/api/ProcessHouse').subscribe(
      (data) => {
        this.process = data;
        this.filteredProcess = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch Weaver';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch process details!',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  setupPagination(data: any[]): void {
    this.paginationConfig.totalItems = data.length;
    this.paginationConfig.totalPages = Math.ceil(data.length / this.paginationConfig.itemsPerPage);
    this.paginateProcess();
  }

  paginateProcess(): void {
    const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemsPerPage;
    const end = start + this.paginationConfig.itemsPerPage;
    this.paginatedProcess = this.filteredProcess.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateProcess();
  }

  filterProcess(): void {
    if (!this.filterValue.trim()) {
      this.filteredProcess = this.process;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredProcess = this.process.filter(process =>
        process.name.toLowerCase().includes(lower) || process.remarks.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredProcess);
  }

  editWeaver(id: number): void {
    this.router.navigate(['/process-house/edit', id]);
  }

  deleteWeaver(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this process!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiEngine.remove('/api/ProcessHouse', id).subscribe({
          next: () => {
            this.process = this.process.filter(process => process.id !== id);
            this.filterProcess();  // reapply filter after delete
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Process has been deleted.',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete process!',
              confirmButtonText: 'Try Again'
            });
          }
        });
      }
    });
  }
}
