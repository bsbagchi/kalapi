import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root', // Root component selector
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, RouterOutlet], // Import necessary Angular modules
  templateUrl: './app.component.html', // Template file for the component
  styleUrls: ['./app.component.scss'], // Style file for the component
})
export class AppComponent {
  
  title = 'kalapi'; // Title property for potential use in the template

}
