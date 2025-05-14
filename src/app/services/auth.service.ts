import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private storageService: StorageService) {
    const savedToken = this.storageService.getItem('spotify_token');
    if (savedToken) {
      console.log('Found saved token:', savedToken);
      this.tokenSubject.next(savedToken);
    }
  }

  login() {
    const clientId = '9dcab34078bc416e859ed8a2657c7d8c';
    const redirectUri = 'https://wpm-one.vercel.app/callback';
    const scopes = 'user-read-private user-read-email user-top-read';

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'token');
    params.append('redirect_uri', redirectUri);
    params.append('scope', scopes);
    params.append('show_dialog', 'true');

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  handleCallback(): boolean {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    console.log('Handling callback, token:', accessToken);

    if (accessToken) {
      this.storageService.setItem('spotify_token', accessToken);
      this.tokenSubject.next(accessToken);
      return true;
    }
    return false;
  }

  getToken(): string | null {
    const token = this.storageService.getItem('spotify_token');
    console.log('Getting token:', token);
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
