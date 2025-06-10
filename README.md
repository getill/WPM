# WMP - Web Music Player 🎵

Une application web moderne pour explorer la musique via l'API Spotify, construite avec Angular.

## 🚀 Fonctionnalités

- 🔍 Recherche d'artistes
- 📱 Interface responsive
- 🎼 Lecture des extraits de morceaux
- 💿 Affichage des albums populaires
- 🎸 Top morceaux des artistes
- 🎯 Intégration directe avec Spotify

## 🛠️ Technologies Utilisées

- Angular
- TypeScript
- TailwindCSS
- API Spotify
- RxJS

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm
- Un compte Spotify Developer
- Un token Spotify valide

## 🚀 Installation

1. Clonez le repository :
```bash
git clone <votre-repo-url>
cd WMP
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez vos variables d'environnement :
   - Créez un fichier `environment.development.ts` dans `src/environments/`
   - Ajoutez votre token Spotify :
```typescript
export const environment = {
  spotifyToken: 'votre-token-spotify'
};
```

4. Lancez l'application :
```bash
ng serve
```

5. Ouvrez votre navigateur sur `http://localhost:4200`

## 📝 License

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.