# Killer AI - Web App (Pass-and-Play)

Une application web mobile-first pour organiser une partie de "Killer" avec génération de missions par IA.

## 🎯 Fonctionnalités

- **Configuration API** : Gestion sécurisée de votre clé API OpenAI (stockée localement)
- **Gestion des joueurs** : Ajout/suppression de joueurs (minimum 3)
- **Génération de missions** : Création automatique de missions drôles et créatives via GPT-4o-mini
- **Mode Pass-and-Play** : Expérience optimisée pour un seul téléphone partagé
- **Révélation sécurisée** : Système de maintien pour révéler les missions sans regard indiscret
- **Design sombre** : Interface moderne avec thème sombre pour une ambiance "espionnage"

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir l'application dans votre navigateur (généralement `http://localhost:5173`)

## 📱 Utilisation

1. **Configuration** : Entrez votre clé API OpenAI et ajustez la température (créativité)
2. **Joueurs** : Ajoutez au moins 3 joueurs
3. **Génération** : Lancez la génération des missions (peut prendre quelques secondes)
4. **Révélation** : Passez le téléphone à chaque joueur pour qu'il découvre sa cible et sa mission
5. **Jeu** : Une fois toutes les missions révélées, le jeu commence !

## 🔧 Technologies

- **React** avec **Vite**
- **TypeScript**
- **Tailwind CSS** (Mobile-first)
- **Lucide React** (Icônes)
- **OpenAI API** (GPT-4o-mini)

## 🔒 Sécurité

- La clé API est stockée uniquement dans le localStorage du navigateur
- Les missions ne sont jamais stockées pour éviter la triche
- Toutes les données de partie sont effacées après une nouvelle partie (sauf la clé API)

## 📝 Notes

- L'application nécessite une clé API OpenAI valide
- Le modèle utilisé est `gpt-4o-mini` (économique et efficace)
- L'application est optimisée pour mobile mais fonctionne aussi sur desktop

