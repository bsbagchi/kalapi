import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  username: string = '';

  constructor(private sidebarService: SidebarService) {}

  onToggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Guest';
  }
}
