import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient, private fb: FormBuilder) {
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
        alert('Quality created successfully!');
      },
      error: (err) => {
        console.error('Error creating Quality:', err);
        alert('Failed to create Quality!');
      }
    });
  }
}

