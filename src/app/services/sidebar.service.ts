import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(this.getInitialState());
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();

  private getInitialState(): boolean {
    // Check if window exists (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      // Return true for desktop (lg breakpoint - 1024px), false for mobile
      return window.innerWidth >= 1024;
    }
    return false;
  }

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  getSidebarState() {
    return this.isSidebarOpenSubject.value;
  }
} 