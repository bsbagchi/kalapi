import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenMonitorService } from './services/token-monitor.service';

@Component({
  selector: 'app-root', // Root component selector
  standalone: true, // Marks this component as standalone
  imports: [CommonModule, RouterOutlet], // Import necessary Angular modules
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  
  title = 'kalapi'; // Title property for potential use in the template

  constructor(private tokenMonitor: TokenMonitorService) {
    // TokenMonitorService will be initialized automatically
  }
}
