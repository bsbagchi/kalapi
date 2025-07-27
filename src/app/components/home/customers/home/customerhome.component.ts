import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../reuse/pagination/pagination.component';
import { PaginationConfig } from '../../../../interfaces/pagination.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  templateUrl: './customerhome.component.html',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
})
export class CustomerHomeComponent implements OnInit {
  title = 'Customer Management';
  customers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];
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
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.apiEngine.getAll('/api/Customer').subscribe(
      (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.setupPagination(data);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch Customers';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch customers!',
        });
      }
    );
  }

  setupPagination(data: any[]): void {
    this.paginationConfig.totalItems = data.length;
    this.paginationConfig.totalPages = Math.ceil(data.length / this.paginationConfig.itemsPerPage);
    this.paginateCustomers();
  }

  paginateCustomers(): void {
    const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemsPerPage;
    const end = start + this.paginationConfig.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(start, end);
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.paginateCustomers();
  }

  filterCustomers(): void {
    if (!this.filterValue.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      const lower = this.filterValue.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(lower) || 
        customer.remarks?.toLowerCase().includes(lower) ||
        customer.email?.toLowerCase().includes(lower) ||
        customer.mobileNo?.toLowerCase().includes(lower)
      );
    }

    this.setupPagination(this.filteredCustomers);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiEngine.remove('/api/Customer', id).subscribe({
          next: () => {
            this.customers = this.customers.filter(customer => customer.id !== id);
            this.filterCustomers();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Customer deleted successfully.',
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete the customer.',
            });
          }
        });
      }
    });
  }
} 