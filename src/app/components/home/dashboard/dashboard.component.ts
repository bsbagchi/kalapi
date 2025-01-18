import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './dashboard.component.html', // Points to the correct HTML file
})
export class DashboardComponent {
  title = 'Dashboard'; // A title property for display or logic
}
