import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SafePipe } from '../pipe/safe.pipe';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from '../services/spotify.service';
import {
  SpotifyArtist,
  SpotifyTrack,
  AudioFeatures,
  TopTracksResponse,
  TrackWithFeatures,
  SpotifySearchResponse,
} from '../types/spotify.types';

@Component({
  standalone: true,
  selector: 'app-api',
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent implements OnDestroy {
  artist?: SpotifyArtist;
  topTracks: TrackWithFeatures[] = [];
  searchQuery: string = '';
  private artistSubscription?: Subscription;
  private topTracksSubscription?: Subscription;

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService
  ) {}

  getTrackFeatures(trackId: string) {
    return this.spotifyService.getTrackFeatures(trackId);
  }

  getTopTracks(artistId: string) {
    this.topTracksSubscription = this.spotifyService
      .getTopTracks(artistId)
      .pipe(
        map((data: TopTracksResponse) => data.tracks.slice(0, 3)),
        mergeMap((tracks: SpotifyTrack[]) => {
          const features$ = tracks.map((track: SpotifyTrack) =>
            this.getTrackFeatures(track.id)
          );
          return forkJoin<AudioFeatures[]>(features$).pipe(
            map((features: AudioFeatures[]) =>
              tracks.map(
                (track: SpotifyTrack, index: number): TrackWithFeatures => ({
                  ...track,
                  features: features[index],
                })
              )
            )
          );
        })
      )
      .subscribe({
        next: (tracksWithFeatures: TrackWithFeatures[]) => {
          this.topTracks = tracksWithFeatures;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:', error);
          this.topTracks = [];
        },
      });
  }

  searchArtist() {
    if (!this.searchQuery.trim()) return;

    this.artistSubscription = this.spotifyService
      .getArtist(this.searchQuery)
      .subscribe({
        next: (data: SpotifySearchResponse) => {
          if (data.artists?.items?.length > 0) {
            this.artist = data.artists.items[0];
            if (this.artist?.id) {
              this.getTopTracks(this.artist.id);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:', error);
          this.artist = undefined;
        },
      });
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
    this.topTracksSubscription?.unsubscribe();
  }
}
