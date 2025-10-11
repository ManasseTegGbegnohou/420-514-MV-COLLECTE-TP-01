# Backend d'Application de Suivi de Séries et Films (⚠️En développement)

## 📋 Description du Projet

Ce backend d'application est un prototype d'API RESTful développée en Node.js avec TypeScript pour la gestion d'une bibliothèque personnelle de contenus audiovisuels (films, séries, mini-séries). Elle permet aux utilisateurs de suivre leurs habitudes de visionnement, d'organiser leur médiathèque personnelle et de générer des statistiques d'usage.

## 🛠️ Stack Technologique

- **TypeScript** - Langage de programmation typé
- **Node.js + Express** - Framework web pour l'API
- **Persistance des données** - Fichier JSON (version prototype)
- **Validation** - Middleware avec expressions régulières
- **Journalisation** - Winston pour les logs
- **Tests** - Collection Postman
- **Structure** - Architecture professionnelle (src/, routes/, models/, etc.)

## 🚀 Installation et Démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Démarrer le serveur en mode développement :**
   ```bash
   npm run dev
   ```

3. **Le serveur sera accessible sur :**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Médias
- `GET /api/medias` - Récupérer tous les médias (avec filtres)
- `GET /api/medias/:id` - Récupérer un média par ID
- `POST /api/medias` - Créer un nouveau média
- `PUT /api/medias/:id` - Modifier un média (admin)
- `DELETE /api/medias/:id` - Supprimer un média (admin)

### Films
- `POST /api/films` - Créer un nouveau film

### Séries
- `POST /api/series` - Créer une nouvelle série
- `GET /api/series/:id/episodes` - Récupérer les épisodes d'une série

### Saisons
- `POST /api/seasons` - Ajouter une saison à une série

### Épisodes
- `POST /api/episodes` - Ajouter un épisode à une saison
- `PATCH /api/episodes/:id` - Marquer un épisode comme vu/non vu

### Utilisateurs
- `GET /api/users/:id/medias` - Récupérer les médias d'un utilisateur

### Logs
- `GET /api/logs` - Consulter les logs de l'application

## 🧪 Tests avec Postman

### Importation de la Collection

1. **Ouvrir Postman**
2. **Importer la collection :**
   - Cliquer sur "Import"
   - Sélectionner le fichier : `src/data/420-514-MV-COLLECTE-TP-01.postman_collection.json`

### Structure de la Collection

La collection est organisée en deux dossiers :

#### **📁 tests**
Contient des exemples de requêtes pour tester les fonctionnalités :

- **GET /medias** - Récupérer tous les médias
- **GET /medias?type=Serie&genre=drama&year=2020** - Filtrage des médias
- **POST /films** - Créer un film (exemple : "The Dark Knight")
- **POST /series** - Créer une série (exemple : "Breaking Bad")
- **POST /seasons** - Ajouter une saison
- **POST /episodes** - Ajouter un épisode
- **PATCH /episodes/:id** - Marquer un épisode comme vu
- **Tests de validation** - Exemples d'erreurs (titre manquant, données invalides)

#### **📁 routes**
Contient toutes les routes disponibles de l'API pour exploration complète.

### Exécution des Tests

1. **Démarrer le serveur** (voir section Installation)
2. **Dans Postman :**
   - Sélectionner une requête
   - Cliquer sur "Send"
   - Vérifier la réponse dans l'onglet "Response"

### Exemples de Données

#### Créer un Film
```json
{
  "title": "The Dark Knight",
  "genre": "Action",
  "year": 2008,
  "rating": 9.0,
  "platform": "Disney",
  "type": "Film",
  "duration": 152
}
```

#### Créer une Série
```json
{
  "title": "Breaking Bad",
  "genre": "Drama",
  "year": 2008,
  "rating": 9.5,
  "platform": "Netflix",
  "type": "Serie",
  "status": "Finished"
}
```

## 🔍 Fonctionnalités Principales

- **Gestion des médias** - Films et séries avec métadonnées complètes
- **Organisation hiérarchique** - Séries → Saisons → Épisodes
- **Suivi de progression** - Marquer les épisodes comme vus
- **Validation robuste** - Contrôle des données avec regex
- **Journalisation complète** - Logs détaillés des opérations
- **Filtrage avancé** - Recherche par type, genre, année, statut
- **Gestion des utilisateurs** - Système de favoris et rôles

## 📊 Base de Données

Les données sont stockées dans `src/data/db.json` et incluent :
- Utilisateurs avec rôles (admin/user)
- Films et séries avec métadonnées
- Saisons et épisodes organisés hiérarchiquement
- Système de favoris par utilisateur

## 🔒 Sécurité et Validation

- **Validation des entrées** avec expressions régulières
- **Contrôle des rôles** pour les opérations sensibles
- **Gestion d'erreurs** centralisée
- **Logs de sécurité** pour le suivi des opérations

---

*Ce projet sert de fondation pour l'intégration future d'une base de données NoSQL (MongoDB), d'analyses périodiques de données et de tests de sécurité avancés.*
