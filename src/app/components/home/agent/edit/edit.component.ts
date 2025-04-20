import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-agent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
})
export class AgentEditComponent implements OnInit {
  title = 'Edit Agent';
  agentForm: FormGroup;
  agentId!: number; // <-- this will hold route param

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.agentForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://www.kalapiprint.somee.com/api/Agent/${this.agentId}`).subscribe({
      next: (data) => {
        // Patch the form with existing values
        this.agentForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching agent:', err);
        alert('Failed to fetch agent details.');
      }
    });
  }

  onSubmit() {
    const now = new Date().toISOString(); // for createdDate / updatedDate
    const payload = {
      id: this.agentId,
      customerId: 0, // Assuming you're not using it now
      name: this.agentForm.value.name,
      remarks: this.agentForm.value.remarks,
      createdDate: now, 
      updatedDate: now
    };

    this.http.put(`http://www.kalapiprint.somee.com/api/Agent/${this.agentId}`, payload).subscribe({
      next: (res) => {
        console.log('Agent updated successfully:', res);
        alert('Agent updated successfully!');
      },
      error: (err) => {
        console.error('Error updating agent:', err);
        alert('Failed to update agent!');
      }
    });
  }
}
