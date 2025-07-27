import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class CustomerAddComponent {
  title = 'Add Customer';
  customerForm: FormGroup;
  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  constructor(private apiEngine: ApiEngineService, private fb: FormBuilder, private router: Router) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gstNo: ['', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      panNo: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      gstState: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      coverAddress: [''],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pinCode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      phoneNoOffice: [''],
      phoneNoResidant: [''],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: [null],
      email: ['', [Validators.email]],
      remarks: [''],
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      // Mark all mandatory fields as touched to trigger validation messages and red borders
      const mandatoryFields = ['name', 'password', 'gstNo', 'panNo', 'gstState', 'address', 'state', 'district', 'city', 'pinCode', 'mobileNo'];
      
      mandatoryFields.forEach((fieldName) => {
        const control = this.customerForm.get(fieldName);
        if (control) {
          control.markAsTouched();
        }
      });
      
      // Also mark optional fields with validation as touched
      const optionalFieldsWithValidation = ['phoneNoOffice', 'phoneNoResidant', 'email'];
      optionalFieldsWithValidation.forEach((fieldName) => {
        const control = this.customerForm.get(fieldName);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }
  
    const payload = {
      customerId: Number(localStorage.getItem('userId')) || 0,
      name: this.customerForm.value.name,
      password: this.customerForm.value.password,
      gstNo: this.customerForm.value.gstNo,
      panNo: this.customerForm.value.panNo,
      gstState: this.customerForm.value.gstState,
      address: this.customerForm.value.address,
      coverAddress: this.customerForm.value.coverAddress || "",
      state: this.customerForm.value.state,
      district: this.customerForm.value.district,
      city: this.customerForm.value.city,
      pinCode: Number(this.customerForm.value.pinCode),
      phoneNoOffice: this.customerForm.value.phoneNoOffice || "",
      phoneNoResidant: this.customerForm.value.phoneNoResidant || "",
      mobileNo: String(this.customerForm.value.mobileNo), // Convert to string
      fax: Number(this.customerForm.value.fax) || 0,
      email: this.customerForm.value.email || "",
      remarks: this.customerForm.value.remarks || ""
    };
  
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  
    this.apiEngine.create('/api/Customer', payload).subscribe({
      next: (res) => {
        console.log('Customer created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Customer created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/customers'])
        });;
      },
      error: (err) => {
        console.error('Error creating Customer:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create Customer!',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }

  scrollToFirstInvalidField(): void {
    // Define the order of mandatory fields (excluding optional ones)
    const mandatoryFields = ['name', 'password', 'gstNo', 'panNo', 'gstState', 'address', 'state', 'district', 'city', 'pinCode', 'mobileNo'];
    
    // Find the first invalid mandatory field
    let firstInvalidField = '';
    
    for (const fieldName of mandatoryFields) {
      const control = this.customerForm.get(fieldName);
      if (control && control.invalid) {
        firstInvalidField = fieldName;
        break;
      }
    }
    
    // If no mandatory field is invalid, check optional fields
    if (!firstInvalidField) {
      const optionalFields = ['phoneNoOffice', 'phoneNoResidant', 'email'];
      for (const fieldName of optionalFields) {
        const control = this.customerForm.get(fieldName);
        if (control && control.invalid) {
          firstInvalidField = fieldName;
          break;
        }
      }
    }
    
    // Scroll to the first invalid field
    if (firstInvalidField) {
      const element = document.getElementById(firstInvalidField);
      if (element) {
        // Add a small delay to ensure the DOM is updated
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Focus the element after scrolling
          setTimeout(() => {
            element.focus();
          }, 300);
        }, 100);
      }
    }
  }
} 