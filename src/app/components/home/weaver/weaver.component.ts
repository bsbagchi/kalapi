import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-weaver', // Correct selector for the Weaver component
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, HeaderComponent,RouterModule,RouterOutlet],
  templateUrl: './weaver.component.html', // Points to the correct HTML file
})
export class WeaverComponent {
  title = 'Weaver'; // A title property for display or logic
}
