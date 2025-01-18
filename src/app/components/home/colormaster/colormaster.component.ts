import { Component } from '@angular/core';


@Component({
  selector: 'app-colormaster', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './colormaster.component.html', // Points to the correct HTML file
})
export class ColormasterComponent {
  title = 'Colormaster'; // A title property for display or logic
}
