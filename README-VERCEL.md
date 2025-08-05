# Déploiement sur Vercel

Ce projet a été adapté pour fonctionner sur Vercel. Voici les modifications apportées :

## Changements principaux

1. **Suppression de Puppeteer** : Puppeteer n'est pas supporté sur les fonctions serverless de Vercel, donc nous utilisons uniquement axios pour les requêtes HTTP.

2. **Structure adaptée** : 
   - Le code principal est maintenant dans `/api/proxy.js`
   - Configuration Vercel dans `vercel.json`
   - Dépendances minimales (uniquement axios)

3. **Fonctionnalités** :
   - Proxy de vidéos via requêtes HTTP simples
   - Support des headers de range pour le streaming
   - CORS activé pour les requêtes cross-origin

## Instructions de déploiement

### 1. Installer Vercel CLI (si ce n'est pas déjà fait)
```bash
npm install -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
```

### 3. Déployer le projet
```bash
vercel
```

Suivez les instructions :
- Confirmez le répertoire du projet
- Choisissez un nom pour votre projet
- Les autres paramètres peuvent rester par défaut

### 4. Déploiement en production
```bash
vercel --prod
```

## Utilisation

Une fois déployé, votre API sera accessible à :
```
https://votre-projet.vercel.app/proxy-video?url=URL_DE_LA_VIDEO
```

## Limitations

- Cette version n'inclut pas l'exécution de JavaScript côté serveur (pas de Puppeteer)
- Les sites nécessitant une authentification complexe ou des cookies spécifiques peuvent ne pas fonctionner
- La durée maximale d'exécution est de 30 secondes sur Vercel

## Alternative avec Puppeteer

Si vous avez absolument besoin de Puppeteer, considérez :
1. Utiliser un VPS ou un serveur dédié
2. Déployer sur Google Cloud Run ou AWS Lambda avec des layers personnalisés
3. Utiliser des services comme Browserless.io en tant que proxy Puppeteer externe
