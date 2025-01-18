import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators'; // Import the filter operator to listen to NavigationEnd
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule], // Import CommonModule here
  templateUrl: './sidebar.component.html',
})


export class SidebarComponent {
  title = 'Sidebar';
  currentUrl: string = ''; // Variable to store the current URL

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Subscribe to NavigationEnd event to get the current URL after navigation ends
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) // Filter to listen for NavigationEnd event
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects; // Update the currentUrl with the active route
      });
  }

  logout(): void {
    // Remove login state from localStorage
    if (this.isBrowser()) {
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Utility function to check if code is running in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Method to check if the current route matches a specific route
  isActive(route: string): boolean {
    return this.currentUrl === route;
  }
}
