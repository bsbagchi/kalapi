import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessService } from '../../../../services/api/process.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';  // 👈 Import
import { PaginationConfig } from '../../../../interfaces/pagination.interface';  // 👈 Import

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

  constructor(private processServce: ProcessService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProcess();
  }

  fetchProcess(): void {
    this.processServce.getProcess().subscribe(
      (data) => {
        this.process = data;
        this.filteredProcess = data;
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
    this.router.navigate(['/weaver/edit', id]);
  }

  deleteWeaver(id: number): void {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.processServce.deleteProcess(id).subscribe({
        next: () => {
          this.process = this.process.filter(process => process.id !== id);
          this.filterProcess();  // reapply filter after delete
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
