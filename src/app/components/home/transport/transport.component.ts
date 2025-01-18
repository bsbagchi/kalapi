import { Component } from '@angular/core';


@Component({
  selector: 'app-transport', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './transport.component.html', // Points to the correct HTML file
})
export class TransportComponent {
  title = 'Transport'; // A title property for display or logic
}
