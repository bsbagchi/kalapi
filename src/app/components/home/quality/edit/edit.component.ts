import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QualityService } from '../../../../services/api/quality.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-quality',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
})
export class QualityEditComponent implements OnInit {
  title = 'Edit Quality';
  qualityForm: FormGroup;
  qualityId!: number; // <-- this will hold route param

  constructor(
    private route: ActivatedRoute,
    private qualityService: QualityService,
    private fb: FormBuilder
  ) {
    this.qualityForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.qualityId = Number(this.route.snapshot.paramMap.get('id'));

    this.qualityService.getQualityById(this.qualityId).subscribe({
      next: (data) => {
        // Patch the form with existing values
        this.qualityForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching Quality:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to fetch Quality details.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onSubmit() {
    const now = new Date().toISOString(); // for createdDate / updatedDate
    const payload = {
      id: this.qualityId,
      customerId: 0, // Assuming you're not using it now
      name: this.qualityForm.value.name,
      remarks: this.qualityForm.value.remarks,
      createdDate: now, 
      updatedDate: now
    };

    this.qualityService.updateQuality(this.qualityId, payload).subscribe({
      next: (res) => {
        console.log('Quality updated successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Quality updated successfully!',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Error updating Quality:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to update Quality!',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}
