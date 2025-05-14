import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-gray-800 shadow-lg">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">WMP</h1>
        
        <ng-container *ngIf="!isLoggedIn">
          <a 
            routerLink="/login"
            class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 
                   transition-colors duration-200 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.53-1.07.29-3.29-2.02-7.439-2.47-12.31-1.35-.479.11-.95-.24-1.07-.71-.11-.479.24-.95.71-1.07 5.359-1.23 10.01-.71 13.66 1.7.369.23.519.721.29 1.07z"/>
            </svg>
            Login with Spotify
          </a>
        </ng-container>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn();
}
