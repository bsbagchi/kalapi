import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentService } from '../../../../services/api/agent.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-aggent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class AgentAddComponent {
  title = 'Add Agent';
  agentForm: FormGroup;

  constructor(private fb: FormBuilder, private agentService: AgentService, private router:Router) {
    this.agentForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  onSubmit(): void {
    const formData = this.agentForm.value;
    const userId = localStorage.getItem('userId');

    const payload = {
      ...formData,
      customerId: userId || 0,

    };

    this.agentService.createAgent(payload).subscribe({
      next: (res) => {
        console.log('Agent created successfully:', res);
        Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Agent details added successfully.',
                    confirmButtonText: 'OK'
                  }).then(()=>{
                    this.router.navigate(['/agent'])
                  });
      },
      error: (err) => {
        console.error('Error creating agent:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to create agent!',
          confirmButtonText: 'Try Again'
        })
      }
    });
  }
}


