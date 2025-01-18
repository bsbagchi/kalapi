import { Component } from '@angular/core';


@Component({
  selector: 'app-printing', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './printing.component.html', // Points to the correct HTML file
})
export class PrintingComponent {
  title = 'Printing'; // A title property for display or logic
}
