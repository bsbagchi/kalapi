import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-transport',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class TransportAddComponent {
  title = 'Add Transport';
  transportForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiEngine: ApiEngineService) {
    this.transportForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      remarks: ['']
    });
  }

  onSubmit() {
    if (this.transportForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.transportForm.controls).forEach((key) => {
        const control = this.transportForm.get(key);
        if (control && key !== 'remarks') {
          control.markAsTouched();
        }
      });
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }

    const formData = this.transportForm.value;
    const userId = localStorage.getItem('userId'); // get userId from localStorage

    const payload = {
      ...formData,
      customerId: Number(userId)  // Add customerId key to payload
    };

    this.apiEngine.create('/api/Transport', payload).subscribe({
      next: (res) => {
        console.log('Transport created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Transport created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/transport'])
        });;
      },
      error: (err) => {
        console.error('Error creating Transport:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create Transport!',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  scrollToFirstInvalidField(): void {
    const invalidFields = Object.keys(this.transportForm.controls).filter(key => {
      const control = this.transportForm.get(key);
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
