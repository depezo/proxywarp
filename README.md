# Advanced Video Proxy Server

Un serveur proxy avancé pour contourner les restrictions de referer et les vérifications d'IP pour le streaming vidéo.

## Fonctionnalités

- ✅ Gestion des sessions avec Puppeteer
- ✅ Contournement des restrictions IP
- ✅ Support des headers personnalisés
- ✅ Plugin Stealth pour éviter la détection
- ✅ Support du streaming progressif

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd advanced-video-proxy
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` (optionnel) pour les configurations

## Utilisation

1. Démarrer le serveur :
```bash
npm start
```

2. Accéder à une vidéo via le proxy :
```
http://localhost:3000/proxy-video?url=URL_DE_LA_VIDEO
```

## Développement

Pour lancer en mode développement avec auto-reload :
```bash
npm run dev
```

## Technologies utilisées

- Node.js / Express.js
- Puppeteer (avec Stealth Plugin)
- Axios
- CORS

## Licence

MIT
