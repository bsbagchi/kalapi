import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
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
    private apiEngine: ApiEngineService,
    private fb: FormBuilder
  ) {
    this.qualityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.qualityId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiEngine.getById<any>('/api/ClothQuality', this.qualityId).subscribe({
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
    if (this.qualityForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.qualityForm.controls).forEach((key) => {
        const control = this.qualityForm.get(key);
        if (control && key !== 'remarks') {
          control.markAsTouched();
        }
      });
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }

    const now = new Date().toISOString(); // for createdDate / updatedDate
    const payload = {
      id: this.qualityId,
      customerId: 0, // Assuming you're not using it now
      name: this.qualityForm.value.name,
      remarks: this.qualityForm.value.remarks,
      createdDate: now, 
      updatedDate: now
    };

    this.apiEngine.update('/api/ClothQuality', this.qualityId, payload).subscribe({
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

  scrollToFirstInvalidField(): void {
    const invalidFields = Object.keys(this.qualityForm.controls).filter(key => {
      const control = this.qualityForm.get(key);
      return control && control.invalid && control.touched && key !== 'remarks';
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
