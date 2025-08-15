import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gray-purchase', // Correct selector for the Gray Purchase component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent,RouterModule,RouterOutlet],
  templateUrl: './process.component.html', // Points to the correct HTML file
})
export class GrayPurchaseComponent {
  title = 'Gray Purchase'; // A title property for display or logic
}
