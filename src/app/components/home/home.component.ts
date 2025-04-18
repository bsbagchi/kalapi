import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../reuse/sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {
  title = 'home';
  currentUrl: string = ''; // Variable to store the current URL
  isDesktop = window.innerWidth >= 1024;
  isSidebarOpen$;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public sidebarService: SidebarService) {
    this.isSidebarOpen$ = this.sidebarService.isSidebarOpen$;
    
    // Subscribe to NavigationEnd event to get the current URL after navigation ends
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) // Filter to listen for NavigationEnd event
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects; // Update the currentUrl with the active route
      });

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth >= 1024;
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

  // Method to toggle the sidebar menu
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}