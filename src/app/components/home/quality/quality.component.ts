import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { PaginationComponent } from '../../reuse/pagination/pagination.component';
import { DataService } from '../../reuse/data/data';
import { PaginationConfig } from '../../../interfaces/pagination.interface';

@Component({
  selector: 'app-quality',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PaginationComponent],
  templateUrl: './quality.component.html'
})
export class QualityComponent implements OnInit {
  title = 'Cloth Quality';
  items: any[] = [];
  paginatedItems: any[] = [];
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.items = this.dataService.data.items;
    this.paginationConfig.totalItems = this.items.length;
    this.paginationConfig.totalPages = Math.ceil(this.items.length / this.paginationConfig.itemsPerPage);
    this.paginateItems();
  }

  paginateItems(): void {
    const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemsPerPage;
    const end = start + this.paginationConfig.itemsPerPage;
    this.paginatedItems = this.items.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateItems();
  }
}
