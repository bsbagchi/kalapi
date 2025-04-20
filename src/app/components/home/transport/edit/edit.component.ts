import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-transport',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
})
export class TransportEditComponent implements OnInit {
  title = 'Edit Transport';
  transportForm: FormGroup;
  transportId!: number; // <-- this will hold route param

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.transportForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.transportId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://www.kalapiprint.somee.com/api/Transport/${this.transportId}`).subscribe({
      next: (data) => {
        // Patch the form with existing values
        this.transportForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching Transport:', err);
        alert('Failed to fetch agent details.');
      }
    });
  }

  onSubmit() {
    const now = new Date().toISOString(); // for createdDate / updatedDate
    const payload = {
      id: this.transportId,
      customerId: 0, // Assuming you're not using it now
      name: this.transportForm.value.name,
      remarks: this.transportForm.value.remarks,
      createdDate: now, 
      updatedDate: now
    };

    this.http.put(`http://www.kalapiprint.somee.com/api/Transport/${this.transportId}`, payload).subscribe({
      next: (res) => {
        console.log('Agent updated successfully:', res);
        alert('Transport updated successfully!');
      },
      error: (err) => {
        console.error('Error updating Transport:', err);
        alert('Failed to update Transport!');
      }
    });
  }
}
