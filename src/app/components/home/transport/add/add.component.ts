import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../reuse/header/header.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient, private fb: FormBuilder) {
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

    this.http.post('http://www.kalapiprint.somee.com/api/Transport', payload).subscribe({
      next: (res) => {
        console.log('Transport created successfully:', res);
        alert('Transport created successfully!');
      },
      error: (err) => {
        console.error('Error creating Transport:', err);
        alert('Failed to create Transport!');
      }
    });
  }
}

