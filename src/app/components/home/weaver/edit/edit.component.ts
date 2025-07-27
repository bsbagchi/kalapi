import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

@Component({
  selector: 'app-edit-weaver',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
})
export class WeaverEditComponent implements OnInit {
  title = 'Edit Agent';
  weaverForm: FormGroup;
  weaverId!: number;
  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiEngine: ApiEngineService,
    private router: Router
  ) {
    this.weaverForm = this.fb.group({
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
      phoneNoOffice: [''],
      phoneNoResidant: [''],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: [null],
      email: ['', [Validators.email]],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.weaverId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiEngine.getById<any>('/api/Weaver', this.weaverId).subscribe({
      next: (data) => {
        this.weaverForm.patchValue({
          name: data.name,
          gstNo: data.gstNo,
          panNo: data.panNo,
          gstState: data.gstState,
          address: data.address,
          coverAddress: data.coverAddress,
          state: data.state,
          district: data.district,
          city: data.city,
          pinCode: data.pinCode,
          phoneNoOffice: data.phoneNoOffice,
          phoneNoResidant: data.phoneNoResidant,
          mobileNo: data.mobileNo,
          fax: data.fax,
          email: data.email,
          remarks: data.remarks,
        });
      },
      error: (err) => {
        console.error('Error fetching agent:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch agent details.',
        });
      }

    });
  }

  onSubmit(): void {
    if (this.weaverForm.invalid) {
      // Mark all mandatory fields as touched to trigger validation messages and red borders
      const mandatoryFields = ['name', 'gstNo', 'panNo', 'gstState', 'address', 'state', 'district', 'city', 'pinCode', 'mobileNo'];
      
      mandatoryFields.forEach((fieldName) => {
        const control = this.weaverForm.get(fieldName);
        if (control) {
          control.markAsTouched();
        }
      });
      
      // Also mark optional fields with validation as touched
      const optionalFieldsWithValidation = ['phoneNoOffice', 'phoneNoResidant', 'email'];
      optionalFieldsWithValidation.forEach((fieldName) => {
        const control = this.weaverForm.get(fieldName);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }

    const payload = {
      id: this.weaverId,
      customerId: Number(localStorage.getItem('userId')) || 0,
      name: this.weaverForm.value.name,
      remarks: this.weaverForm.value.remarks || "",
      gstNo: this.weaverForm.value.gstNo,
      panNo: this.weaverForm.value.panNo,
      gstState: this.weaverForm.value.gstState,
      address: this.weaverForm.value.address,
      coverAddress: this.weaverForm.value.coverAddress || "",
      state: this.weaverForm.value.state,
      district: this.weaverForm.value.district,
      city: this.weaverForm.value.city,
      pinCode: Number(this.weaverForm.value.pinCode),
      phoneNoOffice: this.weaverForm.value.phoneNoOffice || "",
      phoneNoResidant: this.weaverForm.value.phoneNoResidant || "",
      mobileNo: String(this.weaverForm.value.mobileNo), // Convert to string
      fax: Number(this.weaverForm.value.fax) || 0,
      email: this.weaverForm.value.email || "",
    };

    this.apiEngine.update('/api/Weaver', this.weaverId, payload).subscribe({
      next: (res) => {
        console.log('Weaver updated successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Weaver updated successfully!',
        }).then(() => {
          this.router.navigate(['/weaver']);
        });
      },
      error: (err) => {
        console.error('Error updating Weaver:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to update Weaver!',
        });
      }
    });
  }

  scrollToFirstInvalidField(): void {
    // Define the order of mandatory fields (excluding optional ones)
    const mandatoryFields = ['name', 'gstNo', 'panNo', 'gstState', 'address', 'state', 'district', 'city', 'pinCode', 'mobileNo'];
    
    // Find the first invalid mandatory field
    let firstInvalidField = '';
    
    for (const fieldName of mandatoryFields) {
      const control = this.weaverForm.get(fieldName);
      if (control && control.invalid) {
        firstInvalidField = fieldName;
        break;
      }
    }
    
    // If no mandatory field is invalid, check optional fields
    if (!firstInvalidField) {
      const optionalFields = ['phoneNoOffice', 'phoneNoResidant', 'email'];
      for (const fieldName of optionalFields) {
        const control = this.weaverForm.get(fieldName);
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

