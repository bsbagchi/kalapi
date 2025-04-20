import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/api/agent.service';
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
    agentId!: number;
  
    constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private agentService: AgentService // ✅ inject the service
    ) {
      this.agentForm = this.fb.group({
        name: [''],
        remarks: ['']
      });
    }
  
    ngOnInit(): void {
      this.agentId = Number(this.route.snapshot.paramMap.get('id'));
  
      this.agentService.getAgentById(this.agentId).subscribe({
        next: (data) => {
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
  
    onSubmit(): void {
      const now = new Date().toISOString();
      const payload = {
        id: this.agentId,
        customerId: localStorage.getItem('userId'),
        name: this.agentForm.value.name,
        remarks: this.agentForm.value.remarks,

      };
  
      this.agentService.updateAgent(this.agentId, payload).subscribe({
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
  