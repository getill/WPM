import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = environment.clientId;
  private redirectUri = environment.redirectUri;
  private scope = environment.scopes;

  constructor(private storageService: StorageService) {}

  login() {
    const authUrl =
      'https://accounts.spotify.com/authorize' +
      '?client_id=' +
      this.clientId +
      '&response_type=code' + // Changed from 'token' to 'code'
      '&redirect_uri=' +
      this.redirectUri +
      '&scope=' +
      this.scope +
      '&show_dialog=true';

    window.location.href = authUrl;
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
