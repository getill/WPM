export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  uri: string; // Added this required property
  album: {
    images: SpotifyImage[];
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  genres: string[];
  images: SpotifyImage[];
}

export interface AudioFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  danceability: number;
  energy: number;
  key: number;
  tempo: number;
}

export interface TopTracksResponse {
  tracks: SpotifyTrack[];
}

export interface TrackWithFeatures extends SpotifyTrack {
  features: AudioFeatures;
}

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
  };
}
