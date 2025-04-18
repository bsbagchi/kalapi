import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';

@Component({
  selector: 'app-designs', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent],
  templateUrl: './designs.component.html', // Points to the correct HTML file
})
export class DesignComponent {
  title = 'Design'; // A title property for display or logic
}
