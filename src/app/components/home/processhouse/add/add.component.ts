import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessService } from '../../../../services/api/process.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-process',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class ProcessAddComponent {
  title = 'Add Process';
  qualityForm: FormGroup;
  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  constructor(private processService: ProcessService, private fb: FormBuilder, private router:Router) {
    this.qualityForm = this.fb.group({
      name: [''],
      gstNo: [''],
      panNo: [''],
      gstState: [''],
      address: [''],
      coverAddress: [''],
      state: [''],
      district: [''],
      city: [''],
      pinCode: [null],
      phoneNoOffice: [null],
      phoneNoResidant: [null],
      mobileNo: [null],
      fax: [null],
      email: [''],
      remarks: [''],
    });
  }
  onSubmit() {
    if (this.qualityForm.invalid) {
      console.log('Form is invalid'); // ✅ confirm this logs
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields.',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const payload = {
      customerId: Number(localStorage.getItem('userId')) || 0,
      ...this.qualityForm.value,
    };
  
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  
    this.processService.createProcess(payload).subscribe({
      next: (res) => {
        console.log('Process created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Process House created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/process-house'])
        });;
      },
      error: (err) => {
        console.error('Error creating Process House:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create Process House.',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}