import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private apiEngine: ApiEngineService
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
      phoneNoOffice: [null, [Validators.pattern('^[0-9]{10}$')]],
      phoneNoResidant: [null, [Validators.pattern('^[0-9]{10}$')]],
      mobileNo: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.weaverForm.controls).forEach((key) => {
        const control = this.weaverForm.get(key);
        if (control && key !== 'remarks' && key !== 'coverAddress' && key !== 'fax') {
          control.markAsTouched();
        }
      });
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      id: this.weaverId,
      customerId: localStorage.getItem('userId'),
      name: this.weaverForm.value.name,
      remarks: this.weaverForm.value.remarks,
      gstNo: this.weaverForm.value.gstNo,
      panNo: this.weaverForm.value.panNo,
      gstState: this.weaverForm.value.gstState,
      address: this.weaverForm.value.address,
      coverAddress: this.weaverForm.value.coverAddress,
      state: this.weaverForm.value.state,
      district: this.weaverForm.value.district,
      city: this.weaverForm.value.city,
      pinCode: Number(this.weaverForm.value.pinCode),
      phoneNoOffice: Number(this.weaverForm.value.phoneNoOffice),
      phoneNoResidant: Number(this.weaverForm.value.phoneNoResidant),
      mobileNo: Number(this.weaverForm.value.mobileNo),
      fax: Number(this.weaverForm.value.fax),
      email: this.weaverForm.value.email,
    };

    this.apiEngine.update('/api/Weaver', this.weaverId, payload).subscribe({
      next: (res) => {
        console.log('Weaver updated successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Weaver updated successfully!',
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
    const invalidFields = Object.keys(this.weaverForm.controls).filter(key => {
      const control = this.weaverForm.get(key);
      return control && control.invalid && control.touched && key !== 'remarks' && key !== 'coverAddress' && key !== 'fax';
    });

    if (invalidFields.length > 0) {
      const firstInvalidField = invalidFields[0];
      const element = document.getElementById(firstInvalidField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }
}
