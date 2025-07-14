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
  showpanmodal = false;
  pandata: string[] = [];
  newPanValue: string = '';
  editIndex: number = -1;

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
      brokagePercentage: [''],
      selectedPAN: ['']
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
          brokagePercentage: data.brokagePercentage,
          selectedPAN: data.selectedPAN
        });
        // Populate pandata from paNs (comma separated string)
        this.pandata = data.paNs ? data.paNs.split(',') : [];
      },
      error: (err) => {
        console.error('Error fetching agent:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch agent details.',
          confirmButtonText: 'Try Again',
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }

  addPanData(): void {
    if (this.newPanValue && this.newPanValue.trim() !== '') {
      if (this.editIndex >= 0) {
        this.pandata[this.editIndex] = this.newPanValue;
        this.editIndex = -1;
      } else {
        this.pandata.push(this.newPanValue);
      }
      this.newPanValue = '';
    }
  }

  editPanData(index: number): void {
    this.newPanValue = this.pandata[index];
    this.editIndex = index;
  }

  deletePanData(index: number): void {
    this.pandata.splice(index, 1);
    if (this.editIndex === index) {
      this.editIndex = -1;
      this.newPanValue = '';
    } else if (this.editIndex > index) {
      this.editIndex--;
    }
  }

  onSubmit(): void {
    const formData = this.agentForm.value;
    const payload = {
      customerId: localStorage.getItem('userId'),
      name: formData.name,
      remarks: formData.remarks,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      brokage: Number(formData.brokage),
      brokagePercentage: Number(formData.brokagePercentage),
      selectedPAN: formData.selectedPAN,
      paNs: this.pandata.join(',')
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
          window.location.reload();
        });
      }
    });
  }
}
