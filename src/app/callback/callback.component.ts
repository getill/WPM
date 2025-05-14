import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="min-h-screen bg-gray-900 flex items-center justify-center">
      <div class="text-white">
        <p>Processing authentication...</p>
      </div>
    </div>
  `,
  standalone: true,
})
export class CallbackComponent {
  constructor(private authService: AuthService, private router: Router) {
    console.log('Callback component initialized');

    // Petit délai pour s'assurer que le hash est disponible
    setTimeout(() => {
      const success = this.authService.handleCallback();
      console.log('Token processing result:', success);

      if (success) {
        console.log('Authentication successful, redirecting...');
        this.router.navigate(['/']);
      } else {
        console.error('Failed to process authentication');
        this.router.navigate(['/login']);
      }
    }, 100);
  }
}
