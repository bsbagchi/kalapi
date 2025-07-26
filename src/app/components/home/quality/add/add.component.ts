import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiEngineService } from '../../../../services/api/api-engine.service';

@Component({
  selector: 'app-add-Quality',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class QualityAddComponent {
  title = 'Add Quality';
  qualityForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiEngine: ApiEngineService) {
    this.qualityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      remarks: ['']
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
      
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = this.qualityForm.value;
    const userId = localStorage.getItem('userId'); // get userId from localStorage

    const payload = {
      ...formData,
      customerId: userId  // Add customerId key to payload
    };

    this.apiEngine.create('/api/ClothQuality', payload).subscribe({
      next: (res: any) => {
        console.log('Quality created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Quality created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/quality'])
        });
      },
      error: (err: any) => {
        console.error('Error creating Quality:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create Quality!',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}
