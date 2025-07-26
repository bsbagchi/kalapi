import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ApiEngineService } from "../../../../services/api/api-engine.service"
import Swal from "sweetalert2"
import { Router } from "@angular/router"

interface Longing {
  clothQuality: string
  longition: number
}

@Component({
  selector: "app-add-process",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add.component.html",
})
export class ProcessAddComponent {
  title = "Add Process"
  processLonging = ["Cloth Quality1", "Cloth Quality2", "Cloth Quality3", "Cloth Quality4", "Cloth Quality5"]
  qualityForm: FormGroup
  longingForm: FormGroup
  longings: Longing[] = []
  editingIndex = -1
  showLongingModal = false

  states: string[] = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ]

  constructor(
    private apiEngine: ApiEngineService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.qualityForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      gstNo: ["", [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      panNo: ["", [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      gstState: ["", [Validators.required]],
      address: ["", [Validators.required, Validators.minLength(10)]],
      coverAddress: [""],
      state: ["", [Validators.required]],
      district: ["", [Validators.required]],
      city: ["", [Validators.required]],
      pinCode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      phoneNoOffice: [null, [Validators.pattern('^[0-9]{10}$')]],
      phoneNoResidant: [null, [Validators.pattern('^[0-9]{10}$')]],
      mobileNo: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: [null],
      email: ["", [Validators.email]],
      remarks: [""],
    })

    this.longingForm = this.fb.group({
      clothQuality: ["", Validators.required],
      longition: [null, Validators.required],
    })
  }

  openLongingModal() {
    this.showLongingModal = true
    this.longingForm.reset()
    this.editingIndex = -1
  }

  closeLongingModal() {
    this.showLongingModal = false
    this.longingForm.reset()
    this.editingIndex = -1
  }

  submitLongingForm() {
    if (this.longingForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.longingForm.controls).forEach((key) => {
        const control = this.longingForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    const newLonging: Longing = {
      clothQuality: this.longingForm.get("clothQuality")?.value,
      longition: this.longingForm.get("longition")?.value,
    }

    if (this.editingIndex >= 0) {
      // Update existing longing
      this.longings[this.editingIndex] = newLonging
      this.editingIndex = -1

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Process Longing updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      // Add new longing
      this.longings.push(newLonging)

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Process Longing added successfully.",
        timer: 1500,
        showConfirmButton: false,
      })
    }

    // Close modal and reset form
    this.closeLongingModal()
  }

  editLonging(index: number) {
    this.editingIndex = index
    const longing = this.longings[index]

    this.longingForm.patchValue({
      clothQuality: longing.clothQuality,
      longition: longing.longition,
    })

    this.showLongingModal = true
  }

  deleteLonging(index: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.longings.splice(index, 1)
        Swal.fire("Deleted!", "Process Longing has been deleted.", "success")
      }
    })
  }

  onSubmit() {
    if (this.qualityForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.qualityForm.controls).forEach((key) => {
        const control = this.qualityForm.get(key)
        if (control && key !== 'remarks' && key !== 'coverAddress' && key !== 'fax') {
          control.markAsTouched()
        }
      })
      return
    }

    const payload = {
      customerId: Number(localStorage.getItem("userId")) || 0,
      ...this.qualityForm.value,
      processLongings: this.longings,
    }

    console.log("Submitting payload:", JSON.stringify(payload, null, 2))

    this.apiEngine.create('/api/ProcessHouse', payload).subscribe({
      next: (res) => {
        console.log("Process created successfully:", res)
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Process House created successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          this.router.navigate(["/process-house"])
        })
      },
      error: (err) => {
        console.error("Error creating Process House:", err)
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to create Process House.",
          confirmButtonText: "Try Again",
        })
      },
    })
  }
}
