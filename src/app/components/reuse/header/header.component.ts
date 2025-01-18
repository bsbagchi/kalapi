import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule], // Import CommonModule here
  templateUrl: './header.component.html',
})


export class SidebarComponent {
  title = 'Header';
  
}
