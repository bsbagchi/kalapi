import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransportService } from '../../../../services/api/transport.service';
import Swal from 'sweetalert2';

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
  transportId!: number;

  constructor(
    private route: ActivatedRoute,
    private transportService: TransportService,
    private fb: FormBuilder
  ) {
    this.transportForm = this.fb.group({
      name: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.transportId = Number(this.route.snapshot.paramMap.get('id'));

    this.transportService.getTransportById(this.transportId).subscribe({
      next: (data) => {
        this.transportForm.patchValue({
          name: data.name,
          remarks: data.remarks
        });
      },
      error: (err) => {
        console.error('Error fetching Transport:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to fetch transport details.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onSubmit() {
    const now = new Date().toISOString();
    const payload = {
      id: this.transportId,
      customerId: 0,
      name: this.transportForm.value.name,
      remarks: this.transportForm.value.remarks,
      createdDate: now, 
      updatedDate: now
    };

    this.transportService.updateTransport(this.transportId, payload).subscribe({
      next: (res) => {
        console.log('Transport updated successfully:', res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Transport updated successfully!',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Error updating Transport:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to update Transport!',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
