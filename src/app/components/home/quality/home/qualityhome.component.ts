import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';  // 👈 Import
import { PaginationConfig } from '../../../../interfaces/pagination.interface';  // 👈 Import
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qualtiy-home',
  standalone: true,
  templateUrl: './qualityhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class QualityHomeComponent implements OnInit {
  title = 'Cloth Qualtiy Management';
  quality: any[] = [];
  filteredQuality: any[] = [];
  paginatedQuality: any[] = [];
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
    this.fetchQuality();
  }

  fetchQuality(): void {
    this.apiEngine.getAll('/api/ClothQuality').subscribe(
      (data) => {
        this.quality = data;
        this.filteredQuality = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch quality';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to fetch quality details.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  setupPagination(data: any[]): void {
    this.paginationConfig.totalItems = data.length;
    this.paginationConfig.totalPages = Math.ceil(data.length / this.paginationConfig.itemsPerPage);
    this.paginateQuality();
  }

  paginateQuality(): void {
    const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemsPerPage;
    const end = start + this.paginationConfig.itemsPerPage;
    this.paginatedQuality = this.filteredQuality.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateQuality();
  }

  filterQuality(): void {
    if (!this.filterValue.trim()) {
      this.filteredQuality = this.quality;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredQuality = this.quality.filter(quality =>
        quality.name.toLowerCase().includes(lower) || quality.remarks.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredQuality);
  }

  editQuality(id: number): void {
    this.router.navigate(['/quality/edit', id]);
  }

  deleteQuality(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this Quality.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiEngine.remove('/api/ClothQuality', id).subscribe({
          next: () => {
            this.quality = this.quality.filter(quality => quality.id !== id);
            this.filterQuality();  // reapply filter after delete
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Quality deleted successfully!',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete Quality!',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
}
