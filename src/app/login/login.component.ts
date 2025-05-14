import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-gray-900 flex items-center justify-center">
      <button 
        (click)="login()"
        class="px-6 py-3 bg-green-500 text-white rounded-full 
               hover:bg-green-600 transition-colors flex items-center gap-2">
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <!-- Spotify icon SVG path -->
        </svg>
        Connect with Spotify
      </button>
    </div>
  `
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login();
  }
}