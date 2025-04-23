import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessService } from '../../../../services/api/process.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-process',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule
    ],
    templateUrl: './edit.component.html',
  })
  export class ProcessEditComponent implements OnInit {
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
      private processService: ProcessService // ✅ inject the service
    ) {
      this.weaverForm = this.fb.group({
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
  
    ngOnInit(): void {
      this.weaverId = Number(this.route.snapshot.paramMap.get('id'));
  
      this.processService.getProcessById(this.weaverId).subscribe({
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
          console.error('Error fetching Process House:', err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch Process House details!',
            showCancelButton: true,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload(); // 🔁 This will reload the entire page
            }
          });
                    
        }
      });
    }
  
    onSubmit(): void {
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
    
      this.processService.updateProcess(this.weaverId, payload).subscribe({
        next: (res) => {
          console.log('Process House updated successfully:', res);
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Process House details updated successfully.',
            confirmButtonText: 'OK'
          });
        },
        error: (err) => {
          console.error('Error updating Process House:', err);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Failed to update Process House details.',
            confirmButtonText: 'Try Again'
          });
        }
      });
    }
  }