import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransportService } from '../../../../services/api/transport.service';
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

  constructor(private fb: FormBuilder, private router: Router, private transportService: TransportService) {
    this.transportForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  onSubmit() {
    const formData = this.transportForm.value;
    const userId = localStorage.getItem('userId'); // get userId from localStorage

    const payload = {
      ...formData,
      customerId: userId  // Add customerId key to payload
    };

    this.transportService.createTransport(payload).subscribe({
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
}
