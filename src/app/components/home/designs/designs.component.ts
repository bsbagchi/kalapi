import { Component } from '@angular/core';


@Component({
  selector: 'app-desings', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './designs.component.html', // Points to the correct HTML file
})
export class DesignComponent {
  title = 'Design'; // A title property for display or logic
}
