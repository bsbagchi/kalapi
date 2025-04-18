import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root', // Root component selector
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, RouterOutlet], // Import necessary Angular modules
  template: `
    <div *ngIf="isLoading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <!-- Add loading spinner or content here -->
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  
  title = 'kalapi'; // Title property for potential use in the template
  isLoading = true;

  ngOnInit() {
    // Brief timeout to let auth check complete
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }
}
