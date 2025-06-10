import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: SpotifyImage[];
    release_date: string;
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
  popularity: number;
  albums?: SpotifyAlbum[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,  
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  artist?: SpotifyArtist;
  topTracks: SpotifyTrack[] = [];
  searchQuery: string = '';
  private artistSubscription?: Subscription;
  isSidebarOpen = false;
  currentlyPlaying: string | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

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

  getArtistAlbums(artistId: string) {
    this.http
      .get<any>(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=FR&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${environment.spotifyToken}`,
          },
        }
      )
      .subscribe({
        next: (data) => {
          if (this.artist) {
            this.artist.albums = data.items;
          }
        },
        error: (error) => {
          console.error('Error fetching albums:', error);
        },
      });
  }

  searchArtist() {
    if (!this.searchQuery.trim()) return;

    if (!environment.spotifyToken) {
      console.error('Token Spotify manquant');
      return;
    }

    this.artistSubscription = this.http
      .get<any>(`https://api.spotify.com/v1/search?q=${encodeURIComponent(
        this.searchQuery
      )}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${environment.spotifyToken}`,
        },
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Token Spotify expiré ou invalide');
          } else {
            console.error("Erreur lors de la recherche de l'artiste:", error);
          }
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
              this.getArtistAlbums(artist.id);
            }
          } else {
            console.log('Aucun artiste trouvé');
          }
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  playPreview(trackId: string, previewUrl: string | null) {
    if (!previewUrl) {
      console.log('Pas d\'aperçu disponible pour cette piste');
      return;
    }

    if (this.currentlyPlaying === trackId) {
      // Arrêter la lecture
      const audio = document.querySelector(`#audio-${trackId}`) as HTMLAudioElement;
      audio.pause();
      audio.currentTime = 0;
      this.currentlyPlaying = null;
    } else {
      // Arrêter la lecture précédente
      if (this.currentlyPlaying) {
        const previousAudio = document.querySelector(`#audio-${this.currentlyPlaying}`) as HTMLAudioElement;
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
      // Démarrer la nouvelle lecture
      const audio = document.querySelector(`#audio-${trackId}`) as HTMLAudioElement;
      audio.play();
      this.currentlyPlaying = trackId;
    }
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
  }
}

