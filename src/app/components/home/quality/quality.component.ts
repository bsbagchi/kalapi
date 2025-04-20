import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agent', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent,RouterModule,RouterOutlet],
  templateUrl: './quality.component.html', // Points to the correct HTML file
})
export class QualityComponent {
  title = 'Cloth  Quality'; // A title property for display or logic
}
