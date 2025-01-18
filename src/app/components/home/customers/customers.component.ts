import { Component } from '@angular/core';


@Component({
  selector: 'app-customers', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './customers.component.html', // Points to the correct HTML file
})
export class CustomersComponent {
  title = 'Customers'; // A title property for display or logic
}
