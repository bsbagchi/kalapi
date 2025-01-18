import { Component } from '@angular/core';


@Component({
  selector: 'app-colors', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './colors.component.html', // Points to the correct HTML file
})
export class ColorComponent {
  title = 'Colors'; // A title property for display or logic
}
