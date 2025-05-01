import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentService } from '../../../../services/api/agent.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Product {
  name: string;
  bale: number;
  taka: number;
  meter: number;
  rate: number;
  discount: number;
  gst: number;
  amount: number;
}

@Component({
  selector: 'app-add-gray-process',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class GrayProcessAddComponent implements OnInit {
  title = 'Add Gray Process';
  agentForm: FormGroup;
  
  // Mock data for dropdowns
  weavers = [
    { id: '1', name: 'Weaver 1' },
    { id: '2', name: 'Weaver 2' },
    { id: '3', name: 'Weaver 3' }
  ];
  
  processHouses = [
    { id: '1', name: 'Process House 1' },
    { id: '2', name: 'Process House 2' },
    { id: '3', name: 'Process House 3' }
  ];
  
  clothQualities = [
    { id: '1', name: 'Quality 1' },
    { id: '2', name: 'Quality 2' },
    { id: '3', name: 'Quality 3' }
  ];
  
  // Product management
  showProductForm = false;
  products: Product[] = [];
  newProduct: Product = this.initializeNewProduct();
  editingIndex: number = -1;
  
  // Totals
  totalAmount = 0;
  totalGST = 0;
  grandTotal = 0;
  totalQuantity = 0;
  globalDiscount = 0;

  constructor(
    private fb: FormBuilder, 
    private agentService: AgentService, 
    private router: Router
  ) {
    this.agentForm = this.fb.group({
      invoiceNo: [''],
      invoiceDate: [''],
      weaver: [''],
      lotNo: [''],
      processHouse: [''],
      clothQuality: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    // Initialize with current date
    const today = new Date().toISOString().split('T')[0];
    this.agentForm.patchValue({
      invoiceDate: today
    });
  }

  initializeNewProduct(): Product {
    return {
      name: '',
      bale: 0,
      taka: 0,
      meter: 0,
      rate: 0,
      discount: 0,
      gst: 5, // Default GST
      amount: 0
    };
  }

  calculateProductTotal(): void {
    const { meter, rate, discount, gst } = this.newProduct;
    
    // Calculate base amount
    const baseAmount = meter * rate;
    
    // Apply discount
    const discountAmount = baseAmount * (discount / 100);
    const afterDiscount = baseAmount - discountAmount;
    
    // Calculate GST
    const gstAmount = afterDiscount * (gst / 100);
    
    // Set total amount
    this.newProduct.amount = afterDiscount + gstAmount;
  }

  addProduct(): void {
    if (!this.newProduct.name || this.newProduct.meter <= 0 || this.newProduct.rate <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter product name, meter, and rate',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.calculateProductTotal();
    
    if (this.editingIndex > -1) {
      // Update existing product
      this.products[this.editingIndex] = {...this.newProduct};
      this.editingIndex = -1;
    } else {
      // Add new product
      this.products.push({...this.newProduct});
    }
    
    // Reset form and hide it
    this.newProduct = this.initializeNewProduct();
    this.showProductForm = false;
    
    // Recalculate totals
    this.calculateTotals();
  }

  editProduct(index: number): void {
    this.editingIndex = index;
    this.newProduct = {...this.products[index]};
    this.showProductForm = true;
  }

  removeProduct(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.products.splice(index, 1);
        this.calculateTotals();
      }
    });
  }
  
  applyGlobalDiscount(): void {
    if (this.globalDiscount < 0 || this.globalDiscount > 100) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Discount',
        text: 'Discount percentage must be between 0 and 100',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    this.products.forEach(product => {
      product.discount = this.globalDiscount;
      this.calculateProductAmounts(product);
    });
    
    this.calculateTotals();
  }
  
  calculateProductAmounts(product: Product): void {
    const { meter, rate, discount, gst } = product;
    
    // Calculate base amount
    const baseAmount = meter * rate;
    
    // Apply discount
    const discountAmount = baseAmount * (discount / 100);
    const afterDiscount = baseAmount - discountAmount;
    
    // Calculate GST
    const gstAmount = afterDiscount * (gst / 100);
    
    // Set total amount
    product.amount = afterDiscount + gstAmount;
  }

  calculateTotals(): void {
    this.totalAmount = 0;
    this.totalGST = 0;
    this.totalQuantity = 0;
    
    this.products.forEach(product => {
      // Recalculate each product's amount to ensure it's up to date
      this.calculateProductAmounts(product);
      
      const baseAmount = product.meter * product.rate;
      const discountAmount = baseAmount * (product.discount / 100);
      const afterDiscount = baseAmount - discountAmount;
      const gstAmount = afterDiscount * (product.gst / 100);
      
      this.totalAmount += afterDiscount;
      this.totalGST += gstAmount;
      this.totalQuantity += product.meter;
    });
    
    this.grandTotal = this.totalAmount + this.totalGST;
  }

  onSubmit(): void {
    if (this.products.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Products',
        text: 'Please add at least one product',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const formData = this.agentForm.value;
    const userId = localStorage.getItem('userId');

    const payload = {
      ...formData,
      customerId: userId || 0,
      products: this.products,
      totalAmount: this.totalAmount,
      totalGST: this.totalGST,
      grandTotal: this.grandTotal
    };

    this.agentService.createAgent(payload).subscribe({
      next: (res) => {
        console.log('Gray process created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Gray process added successfully.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/agent']);
        });
      },
      error: (err) => {
        console.error('Error creating gray process:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create gray process!',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}