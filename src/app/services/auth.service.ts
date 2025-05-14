import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = 'YOUR_CLIENT_ID'; // From Spotify Developer Dashboard
  private redirectUri = 'http://localhost:4200/callback';
  private scope = 'user-read-private user-read-email user-top-read';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      scope: this.scope,
      show_dialog: 'true',
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  handleCallback(): boolean {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      this.storageService.setItem('spotify_token', accessToken);
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return this.storageService.getItem('spotify_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.storageService.removeItem('spotify_token');
  }
}
