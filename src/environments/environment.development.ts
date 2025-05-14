export const environment = {
  production: false,
  clientId: '9dcab34078bc416e859ed8a2657c7d8c',
  redirectUri: 'http://localhost:4200/callback/',
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
  ].join(' '),
};
