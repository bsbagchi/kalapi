import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/api/agent.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  providers: [FormBuilder] // <-- Add this line
})
export class AgentEditComponent implements OnInit {
  title = 'Update Agent';
  agentForm: FormGroup;
  agentId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private agentService: AgentService
  ) {
    this.agentForm = this.fb.group({
      name: [''],
      remarks: [''],
      address: [''],
      mobileNumber: [''],
      brokage: [''],
      brokagePercentage: ['']
    });
  }

  ngOnInit(): void {
    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    this.agentService.getAgentById(this.agentId).subscribe({
      next: (data) => {
        this.agentForm.patchValue({
          name: data.name,
          remarks: data.remarks,
          address: data.address,
          mobileNumber: data.mobileNumber,
          brokage: data.brokage,
          brokagePercentage: data.brokagePercentage
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
    const now = new Date().toISOString();
    const payload = {
      id: this.agentId,
      customerId: localStorage.getItem('userId'),
      name: this.agentForm.value.name,
      remarks: this.agentForm.value.remarks,
      address: this.agentForm.value.address,
      mobileNumber: this.agentForm.value.mobileNumber,
      brokage: this.agentForm.value.brokage,
      brokagePercentage: this.agentForm.value.brokagePercentage
    };

    this.agentService.updateAgent(this.agentId, payload).subscribe({
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
