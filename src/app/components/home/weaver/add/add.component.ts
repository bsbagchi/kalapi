import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-weaver',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class WeaverAddComponent {
  title = 'Add Weaver';
  qualityForm: FormGroup;
  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  constructor(private apiEngine: ApiEngineService, private fb: FormBuilder, private router:Router) {
    this.qualityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gstNo: ['', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      panNo: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      gstState: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      coverAddress: [''],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pinCode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      phoneNoOffice: [null, [Validators.pattern('^[0-9]{10}$')]],
      phoneNoResidant: [null, [Validators.pattern('^[0-9]{10}$')]],
      mobileNo: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: [null],
      email: ['', [Validators.email]],
      remarks: [''],
    });
  }

  onSubmit() {
    if (this.qualityForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.qualityForm.controls).forEach((key) => {
        const control = this.qualityForm.get(key);
        if (control && key !== 'remarks' && key !== 'coverAddress' && key !== 'fax') {
          control.markAsTouched();
        }
      });
      
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const payload = {
      customerId: Number(localStorage.getItem('userId')) || 0,
      ...this.qualityForm.value,
    };
  
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  
    this.apiEngine.create('/api/Weaver', payload).subscribe({
      next: (res) => {
        console.log('Weaver created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Weaver created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/weaver'])
        });;
      },
      error: (err) => {
        console.error('Error creating Weaver:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create Weaver!',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}
