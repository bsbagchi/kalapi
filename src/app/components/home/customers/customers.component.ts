import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, RouterOutlet],
  templateUrl: './customers.component.html',
})
export class CustomersComponent {
  title = 'Customers';
}
