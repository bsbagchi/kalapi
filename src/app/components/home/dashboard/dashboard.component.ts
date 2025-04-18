import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';

@Component({
  selector: 'app-dashboard', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent], // Points to the correct HTML file
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  title = 'Dashboard'; // A title property for display or logic
}
