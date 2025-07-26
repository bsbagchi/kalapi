import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
      name: ['', [Validators.required, Validators.minLength(2)]],
      remarks: [''],
      address: ['', [Validators.required, Validators.minLength(5)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      brokage: ['', [Validators.required, Validators.min(0)]],
      brokagePercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      selectedPAN: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]]
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
      
      // Auto scroll to first invalid field
      this.scrollToFirstInvalidField();
      return;
    }

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

  scrollToFirstInvalidField(): void {
    const invalidFields = Object.keys(this.agentForm.controls).filter(key => {
      const control = this.agentForm.get(key);
      return control && control.invalid && control.touched && key !== 'remarks';
    });

    if (invalidFields.length > 0) {
      const firstInvalidField = invalidFields[0];
      const element = document.getElementById(firstInvalidField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }
}


