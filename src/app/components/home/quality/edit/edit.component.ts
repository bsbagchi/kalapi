import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.qualityForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.qualityId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://www.kalapiprint.somee.com/api/ClothQuality/${this.qualityId}`).subscribe({
      next: (data) => {
        // Patch the form with existing values
        this.qualityForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching Quality:', err);
        alert('Failed to fetch Quality details.');
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

    this.http.put(`http://www.kalapiprint.somee.com/api/ClothQuality/${this.qualityId}`, payload).subscribe({
      next: (res) => {
        console.log('Quality updated successfully:', res);
        alert('Quality updated successfully!');
      },
      error: (err) => {
        console.error('Error updating Quality:', err);
        alert('Failed to update Quality!');
      }
    });
  }
}
