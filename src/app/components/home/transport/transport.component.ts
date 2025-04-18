import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transport', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent,RouterOutlet],
  templateUrl: './transport.component.html', // Points to the correct HTML file
})
export class TransportComponent {
  title = 'Transport'; // A title property for display or logic
}
