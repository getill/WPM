import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  album: {
    images: SpotifyImage[];
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  genres: string[];
  images: SpotifyImage[];
}

@Component({
  standalone: true,
  selector: 'app-api',
  imports: [CommonModule, FormsModule],
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent implements OnDestroy {
  artist?: SpotifyArtist;
  topTracks: SpotifyTrack[] = [];
  searchQuery: string = '';
  private artistSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  getTopTracks(artistId: string) {
    this.http
      .get<any>(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`,
        {
          headers: {
            Authorization: `Bearer ${environment.spotifyToken}`,
          },
        }
      )
      .subscribe({
        next: (data) => {
          this.topTracks = data.tracks.slice(0, 3);
        },
        error: (error) => {
          console.error('Error fetching top tracks:', error);
        },
      });
  }

  searchArtist() {
    if (!this.searchQuery.trim()) return;

    this.artistSubscription = this.http
      .get<any>(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          this.searchQuery
        )}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${environment.spotifyToken}`,
          },
        }
      )
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de la recherche de l'artiste:", error);
          throw error;
        })
      )
      .subscribe({
        next: (data) => {
          if (data.artists?.items?.length > 0) {
            const artist = data.artists.items[0];
            this.artist = artist;
            if (artist?.id) {
              this.getTopTracks(artist.id);
            }
          }
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
  }
}
