import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private fb: FormBuilder, private router:Router) {
    this.qualityForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  onSubmit() {
    const formData = this.qualityForm.value;
    const userId = localStorage.getItem('userId'); // get userId from localStorage

    const payload = {
      ...formData,
      customerId: userId  // Add customerId key to payload
    };

    this.http.post('http://www.kalapiprint.somee.com/api/ClothQuality', payload).subscribe({
      next: (res) => {
        console.log('Quality created successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Quality created successfully!',
          confirmButtonText: 'OK'
        }).then(()=>{
          this.router.navigate(['/quality'])
        });;
      },
      error: (err) => {
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
