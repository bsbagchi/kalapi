import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiEngineService } from '../../../../services/api/api-engine.service';
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
  showpanmodal=false;
  pandata: string[] = []; // Array to store PAN numbers
  newPanValue: string = ''; // Holds the value from the input field
  editIndex: number = -1; // Track if we're in edit mode

  // Add new PAN to the array
  addPanData(): void {
    if (this.newPanValue && this.newPanValue.trim() !== '') {
      if (this.editIndex >= 0) {
        // Update existing entry if in edit mode
        this.pandata[this.editIndex] = this.newPanValue;
        this.editIndex = -1;
      } else {
        // Add new entry
        this.pandata.push(this.newPanValue);
      }
      
      // Reset the input field
      this.newPanValue = '';
    }
  }

  // Put PAN data in edit mode
  editPanData(index: number): void {
    this.newPanValue = this.pandata[index];
    this.editIndex = index;
  }

  // Delete PAN data
  deletePanData(index: number): void {
    this.pandata.splice(index, 1);
    
    // If deleting the item that's being edited, reset edit mode
    if (this.editIndex === index) {
      this.editIndex = -1;
      this.newPanValue = '';
    } else if (this.editIndex > index) {
      // Adjust editIndex if deleting an item before the one being edited
      this.editIndex--;
    }
  }
  constructor(private fb: FormBuilder, private apiEngine: ApiEngineService, private router:Router) {
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

  

  onSubmit(): void {
    const formData = this.agentForm.value;
    const userId = localStorage.getItem('userId');

    const payload = {
      customerId: userId || 0,
      name: formData.name,
      remarks: formData.remarks,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      brokage: Number(formData.brokage),
      brokagePercentage: Number(formData.brokagePercentage),
      selectedPAN: formData.selectedPAN,
      paNs: this.pandata.join(',')
    };

    this.apiEngine.create('/api/Agent', payload).subscribe({
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


