import { Component } from '@angular/core';


@Component({
  selector: 'app-quality', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './quality.component.html', // Points to the correct HTML file
})
export class QualityComponent {
  title = 'Cloth Quality'; // A title property for display or logic
}
