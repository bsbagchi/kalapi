import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-process',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
})
export class GrayProcessEditComponent implements OnInit {
  title = 'Update Process';
  agentForm: FormGroup;
  agentId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiEngine: ApiEngineService // ✅ inject the service
  ) {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiEngine.getById<any>('/api/Agent', this.agentId).subscribe({
      next: (data) => {
        this.agentForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching agent:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch agent details.',
          confirmButtonText: 'Try Again',
        }).then(() => {
          // Reload the page if user clicks 'Try Again'
          window.location.reload();
        });
      }
    });
  }

  onSubmit(): void {
    if (this.agentForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.agentForm.controls).forEach((key) => {
        const control = this.agentForm.get(key);
        if (control && key !== 'remarks') {
          control.markAsTouched();
        }
      });
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      id: this.agentId,
      customerId: Number(localStorage.getItem('userId')) || 0,
      name: this.agentForm.value.name,
      remarks: this.agentForm.value.remarks,
    };

    this.apiEngine.update('/api/Agent', this.agentId, payload).subscribe({
      next: (res) => {
        console.log('Agent updated successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Agent details updated successfully.',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Error updating agent:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to update agent!',
          confirmButtonText: 'Try Again'
        }).then(() => {
          // Reload the page if user clicks 'Try Again'
          window.location.reload();
        });
      }
    });
  }
}
