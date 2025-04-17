import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  username: string = 'admin';
  email: string = 'admin@gmail.com';
  password: string = 'password123';

  constructor(private router: Router) {}

  onCancel() {
    this.router.navigate(['/']);
  }

  onUpdate() {
    // Handle update logic
  }
}
