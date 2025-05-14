import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="min-h-screen bg-gray-900 flex items-center justify-center">
      <div class="text-center text-white">
        <p>Processing authentication...</p>
      </div>
    </div>
  `,
  standalone: true,
})
export class CallbackComponent {
  constructor(private authService: AuthService, private router: Router) {
    console.log('Callback component initialized'); // Debug
    if (this.authService.handleCallback()) {
      console.log('Token successfully stored'); // Debug
      this.router.navigate(['/']);
    } else {
      console.error('Failed to handle callback'); // Debug
      this.router.navigate(['/login']);
    }
  }
}
