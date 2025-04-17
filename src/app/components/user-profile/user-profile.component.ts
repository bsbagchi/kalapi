import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../reuse/header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  username: string = 'kalapi-printer';
  email: string = 'kalapiprint.2233@gmail.com';
  password: string = '••••••••••';

  onUpdate() {
    // Handle update logic
  }
} 