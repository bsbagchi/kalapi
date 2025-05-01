import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-weaver', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent,RouterModule,RouterOutlet],
  templateUrl: './purchase.component.html', // Points to the correct HTML file
})
export class GrayPurchaseComponent {
  title = 'Gray Purchase'; // A title property for display or logic
}
