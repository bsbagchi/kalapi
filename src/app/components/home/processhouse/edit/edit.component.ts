import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeaverService } from '../../../../services/api/weaver.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      private weaverService: WeaverService // ✅ inject the service
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
  
      this.weaverService.getWeaverById(this.weaverId).subscribe({
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
          alert('Failed to fetch agent details.');
        }
      });
    }
  
    onSubmit(): void {
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
  
      this.weaverService.updateWeaver(this.weaverId, payload).subscribe({
        next: (res) => {
          console.log('Weaver updated successfully:', res);
          alert('Weaver updated successfully!');
        },
        error: (err) => {
          console.error('Error updating Weaver:', err);
          alert('Failed to update Weaver!');
        }
      });
    }
  }
  