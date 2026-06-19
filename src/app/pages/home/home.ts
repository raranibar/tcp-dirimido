import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private authService = inject(AuthService);

  onLogout(event: Event): void{
    event.preventDefault();
    this.authService.logout();
  }
}
