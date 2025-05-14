import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {
  SpotifySearchResponse,
  TopTracksResponse,
  AudioFeatures,
} from '../types/spotify.types';

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

  getArtist(query: string): Observable<SpotifySearchResponse> {
    return this.http.get<SpotifySearchResponse>(
      `${this.apiUrl}/search?q=${encodeURIComponent(
        query
      )}&type=artist&limit=1`,
      { headers: this.getHeaders() }
    );
  }

  getTopTracks(artistId: string): Observable<TopTracksResponse> {
    return this.http.get<TopTracksResponse>(
      `${this.apiUrl}/artists/${artistId}/top-tracks?market=FR`,
      { headers: this.getHeaders() }
    );
  }

  getTrackFeatures(trackId: string): Observable<AudioFeatures> {
    return this.http.get<AudioFeatures>(
      `${this.apiUrl}/audio-features/${trackId}`,
      { headers: this.getHeaders() }
    );
  }
}
