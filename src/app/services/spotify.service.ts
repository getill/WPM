import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 403) {
      console.error(
        'Access forbidden. Please check your token and permissions.'
      );
      this.authService.login(); // Redirect to login if token is invalid
    }
    return throwError(() => error);
  }

  getArtist(query: string): Observable<any> {
    return this.http
      .get(
        `${this.apiUrl}/search?q=${encodeURIComponent(
          query
        )}&type=artist&limit=1`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  getTopTracks(artistId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/artists/${artistId}/top-tracks?market=FR`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getTrackFeatures(trackId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/audio-features/${trackId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
