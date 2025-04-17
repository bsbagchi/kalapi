import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationConfig } from '../../../interfaces/pagination.interface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="config.totalPages > 1" class="flex justify-end gap-2 mt-4">
      <button
        (click)="onPageChange(config.currentPage - 1)"
        [disabled]="config.currentPage === 1"
        class="bg-gray-300 hover:bg-gray-400 font-semibold text-blue-800 w-10 h-10 flex items-center justify-center rounded-lg disabled:opacity-50">
        &lt;
      </button>

      <ng-container *ngFor="let page of getVisiblePages()">
        <button
          (click)="onPageChange(page)"
          [class.bg-[--primary]]="page === config.currentPage"
          [class.text-white]="page === config.currentPage"
          [class.text-blue-800]="page !== config.currentPage"
          class="hover:bg-[--primary] hover:text-white w-10 h-10 flex items-center justify-center rounded-lg">
          {{ page }}
        </button>
      </ng-container>

      <button
        (click)="onPageChange(config.currentPage + 1)"
        [disabled]="config.currentPage === config.totalPages"
        class="bg-gray-300 hover:bg-gray-400 text-blue-800 font-semibold w-10 h-10 flex items-center justify-center rounded-lg disabled:opacity-50">
        &gt;
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() config: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  };

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.config.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, this.config.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.config.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
