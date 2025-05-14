import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = environment.clientId;
  private redirectUri = environment.redirectUri;
  private scope = environment.scopes;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private storageService: StorageService) {
    // Check for existing token on init
    const savedToken = this.storageService.getItem('spotify_token');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

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
      console.log('Token received:', accessToken); // Debug
      this.storageService.setItem('spotify_token', accessToken);
      this.tokenSubject.next(accessToken);
      return true;
    }
    return false;
  }

  getToken(): string | null {
    const token = this.storageService.getItem('spotify_token');
    console.log('Current token:', token); // Debug
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.storageService.removeItem('spotify_token');
    this.tokenSubject.next(null);
  }
}
