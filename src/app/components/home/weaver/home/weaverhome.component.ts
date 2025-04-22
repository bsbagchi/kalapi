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

  constructor(private WeaverServce: WeaverService, private router: Router) {}

  ngOnInit(): void {
    this.fetchWeaver();
  }

  fetchWeaver(): void {
    this.WeaverServce.getWeaver().subscribe(
      (data) => {
        this.weaver = data;
        this.filteredWeaver = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch Weaver';
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
    if (confirm('Are you sure you want to delete this agent?')) {
      this.WeaverServce.deleteWeaver(id).subscribe({
        next: () => {
          this.weaver = this.weaver.filter(weaver => weaver.id !== id);
          this.filterWeaver();  // reapply filter after delete
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
