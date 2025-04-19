import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../reuse/header/header.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.agentForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  onSubmit() {
    const payload = this.agentForm.value;

    this.http.post('http://www.kalapiprint.somee.com/api/Agent', payload).subscribe({
      next: (res) => {
        console.log('Agent created successfully:', res);
        alert('Agent created successfully!');
      },
      error: (err) => {
        console.error('Error creating agent:', err);
        alert('Failed to create agent!');
      }
    });
  }
}

