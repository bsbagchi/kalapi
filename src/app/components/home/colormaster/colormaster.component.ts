import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';

@Component({
  selector: 'app-colormaster', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent],
  templateUrl: './colormaster.component.html', // Points to the correct HTML file
})
export class ColormasterComponent {
  title = 'Colormaster'; // A title property for display or logic
}
