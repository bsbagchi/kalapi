import { Component, OnInit, ViewChild, ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ApiEngineService } from "../../../../services/api/api-engine.service"
import Swal from "sweetalert2"
import { Router } from "@angular/router"
import { DomSanitizer, SafeUrl } from "@angular/platform-browser"

interface Product {
  name: string
  bale: number
  taka: number
  meter: number
  rate: number
  discount: number
  gst: number
  amount: number
}

@Component({
  selector: "app-add-gray-purchase",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add.component.html",
})
export class GrayPurchaseAddComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>

  title = "Add Gray Purchase"
  agentForm: FormGroup

  // Mock data for dropdowns
  weavers = [
    { id: "1", name: "Weaver 1" },
    { id: "2", name: "Weaver 2" },
    { id: "3", name: "Weaver 3" },
  ]

  processHouses = [
    { id: "1", name: "Process House 1" },
    { id: "2", name: "Process House 2" },
    { id: "3", name: "Process House 3" },
  ]

  clothQualities = [
    { id: "1", name: "Quality 1" },
    { id: "2", name: "Quality 2" },
    { id: "3", name: "Quality 3" },
  ]

  // Product management
  showProductForm = false
  products: Product[] = []
  newProduct: Product = this.initializeNewProduct()
  editingIndex = -1

  // Totals
  totalAmount = 0
  totalGST = 0
  grandTotal = 0
  totalQuantity = 0
  globalDiscount = 0
  totalDiscountAmount = 0 // Added for tracking total discount amount

  // File upload properties
  selectedFile: File | null = null
  previewUrl: string | null = null
  uploadProgress = 0
  uploadError: string | null = null
  isDragging = false
  showPdfViewer = false
  pdfViewerUrl: SafeUrl | null = null

  constructor(
    private fb: FormBuilder,
    private apiEngine: ApiEngineService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.agentForm = this.fb.group({
      invoiceNo: ["", [Validators.required, Validators.minLength(2)]],
      invoiceDate: ["", [Validators.required]],
      weaver: ["", [Validators.required]],
      lotNo: ["", [Validators.required, Validators.minLength(2)]],
      processHouse: ["", [Validators.required]],
      clothQuality: ["", [Validators.required]],
      remarks: [""],
      billFile: [null], // Hidden form control for the file
    })
  }

  ngOnInit(): void {
    // Initialize with current date
    const today = new Date().toISOString().split("T")[0]
    this.agentForm.patchValue({
      invoiceDate: today,
    })
  }

  // File upload methods
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0])
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0])
    }
  }

  processFile(file: File): void {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      this.uploadError = "File size exceeds 5MB limit"
      return
    }

    // Check file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      this.uploadError = "Only PDF, JPG, JPEG, and PNG files are allowed"
      return
    }

    this.selectedFile = file
    this.uploadError = null

    // Update form control
    this.agentForm.patchValue({
      billFile: file,
    })

    // Create preview for images
    if (file.type.includes("image")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      this.previewUrl = null
    }

    // Simulate upload progress (for demo purposes)
    this.simulateUploadProgress()
  }

  simulateUploadProgress(): void {
    this.uploadProgress = 0
    const interval = setInterval(() => {
      this.uploadProgress += 10
      if (this.uploadProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          this.uploadProgress = 0
        }, 1000)
      }
    }, 200)
  }

  removeFile(): void {
    this.selectedFile = null
    this.previewUrl = null
    this.uploadProgress = 0
    this.uploadError = null

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ""
    }

    // Clear form control
    this.agentForm.patchValue({
      billFile: null,
    })
  }

  viewFile(): void {
    if (this.selectedFile && this.selectedFile.type === "application/pdf") {
      // Create object URL for PDF viewing
      const fileUrl = URL.createObjectURL(this.selectedFile)
      this.pdfViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl)
      this.showPdfViewer = true
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  initializeNewProduct(): Product {
    return {
      name: "",
      bale: 0,
      taka: 0,
      meter: 0,
      rate: 0,
      discount: 0,
      gst: 5, // Default GST
      amount: 0,
    }
  }

  calculateProductTotal(): void {
    const { meter, rate, discount, gst } = this.newProduct

    // Calculate base amount
    const baseAmount = meter * rate

    // Apply discount
    const discountAmount = baseAmount * (discount / 100)
    const afterDiscount = baseAmount - discountAmount

    // Calculate GST
    const gstAmount = afterDiscount * (gst / 100)

    // Set total amount
    this.newProduct.amount = afterDiscount + gstAmount
  }

  addProduct(): void {
    if (!this.newProduct.name || this.newProduct.meter <= 0 || this.newProduct.rate <= 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter product name, meter, and rate",
        confirmButtonText: "OK",
      })
      return
    }

    this.calculateProductTotal()

    if (this.editingIndex > -1) {
      // Update existing product
      this.products[this.editingIndex] = { ...this.newProduct }
      this.editingIndex = -1
    } else {
      // Add new product
      this.products.push({ ...this.newProduct })
    }

    // Reset form and hide it
    this.newProduct = this.initializeNewProduct()
    this.showProductForm = false

    // Recalculate totals
    this.calculateTotals()
  }

  editProduct(index: number): void {
    this.editingIndex = index
    this.newProduct = { ...this.products[index] }
    this.showProductForm = true
  }

  removeProduct(index: number): void {
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
        this.products.splice(index, 1)
        this.calculateTotals()
      }
    })
  }

  applyGlobalDiscount(): void {
    if (this.globalDiscount < 0 || this.globalDiscount > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Discount",
        text: "Discount percentage must be between 0 and 100",
        confirmButtonText: "OK",
      })
      return
    }

    this.products.forEach((product) => {
      product.discount = this.globalDiscount
      this.calculateProductAmounts(product)
    })

    this.calculateTotals()
  }

  calculateProductAmounts(product: Product): void {
    const { meter, rate, discount, gst } = product

    // Calculate base amount
    const baseAmount = meter * rate

    // Apply discount
    const discountAmount = baseAmount * (discount / 100)
    const afterDiscount = baseAmount - discountAmount

    // Calculate GST
    const gstAmount = afterDiscount * (gst / 100)

    // Set total amount
    product.amount = afterDiscount + gstAmount
  }

  calculateTotals(): void {
    this.totalAmount = 0
    this.totalGST = 0
    this.totalQuantity = 0
    this.totalDiscountAmount = 0 // Reset total discount amount

    this.products.forEach((product) => {
      // Recalculate each product's amount to ensure it's up to date
      this.calculateProductAmounts(product)

      const baseAmount = product.meter * product.rate
      const discountAmount = baseAmount * (product.discount / 100)
      const afterDiscount = baseAmount - discountAmount
      const gstAmount = afterDiscount * (product.gst / 100)

      this.totalAmount += afterDiscount
      this.totalGST += gstAmount
      this.totalQuantity += product.meter
      this.totalDiscountAmount += discountAmount // Track total discount amount
    })

    this.grandTotal = this.totalAmount + this.totalGST
  }

  onSubmit(): void {
    if (this.agentForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.agentForm.controls).forEach((key) => {
        const control = this.agentForm.get(key);
        if (control && key !== 'remarks' && key !== 'billFile') {
          control.markAsTouched();
        }
      });
      return;
    }

    if (this.products.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Products",
        text: "Please add at least one product",
        confirmButtonText: "OK",
      })
      return
    }

    const formData = this.agentForm.value
    const userId = localStorage.getItem("userId")

    // Create FormData for file upload
    const submitData = new FormData()

    // Add form fields
    Object.keys(formData).forEach((key) => {
      if (key !== "billFile") {
        submitData.append(key, formData[key])
      }
    })

    // Add file if selected
    if (this.selectedFile) {
      submitData.append("billFile", this.selectedFile, this.selectedFile.name)
    }

    // Add other data
          submitData.append("customerId", (Number(userId) || 0).toString())
    submitData.append("products", JSON.stringify(this.products))
    submitData.append("totalAmount", this.totalAmount.toString())
    submitData.append("totalGST", this.totalGST.toString())
    submitData.append("totalDiscountAmount", this.totalDiscountAmount.toString())
    submitData.append("grandTotal", this.grandTotal.toString())

    this.apiEngine.create('/api/Agent', submitData).subscribe({
      next: (res) => {
        console.log("Gray process created successfully:", res)
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Gray process added successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          this.router.navigate(["/gray-purchase"])
        })
      },
      error: (err) => {
        console.error("Error creating gray process:", err)
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to create gray process!",
          confirmButtonText: "Try Again",
        })
      },
    })
  }
}
