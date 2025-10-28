# Backend d'Application de Suivi de Séries et Films (En développement)

## Description du Projet

Ce backend d'application est un prototype d'API RESTful développée en Node.js avec TypeScript pour la gestion d'une bibliothèque personnelle de contenus audiovisuels (films, séries, mini-séries). Elle permet aux utilisateurs de suivre leurs habitudes de visionnement, d'organiser leur médiathèque personnelle et de générer des statistiques d'usage.

## Stack Technologique

- **TypeScript** - Langage de programmation typé
- **Node.js + Express** - Framework web pour l'API
- **Persistance des données** - Fichier JSON (v1) + MongoDB (v2)
- **Validation** - Middleware avec expressions régulières
- **Journalisation** - Winston pour les logs
- **Tests** - Collection Postman
- **Structure** - Architecture professionnelle (src/, routes/, models/, etc.)

## Prérequis

### Logiciels requis

- **Node.js** (v16 ou supérieur) - [Télécharger Node.js](https://nodejs.org/)
- **MongoDB Community Server** - [Télécharger MongoDB](https://www.mongodb.com/try/download/community)
- **MongoDB Shell (mongosh)** - [Télécharger mongosh](https://www.mongodb.com/try/download/shell)
- **npm** (inclus avec Node.js)

### Installation des prérequis

#### 1. Node.js
```bash
# Vérifier l'installation
node --version
npm --version
```

#### 2. MongoDB Community Server
- **Windows** : Télécharger et installer depuis le site officiel MongoDB
- **macOS** : `brew install mongodb-community`
- **Linux** : Suivre les instructions officielles MongoDB

```bash
# Vérifier l'installation
mongod --version
```

#### 3. MongoDB Shell (mongosh)
- **Windows** : Télécharger et installer depuis le site officiel MongoDB
- **macOS** : `brew install mongosh`
- **Linux** : Suivre les instructions officielles MongoDB

```bash
# Vérifier l'installation
mongosh --version
```

## Installation et Démarrage

### Étape 1 : Installation des dépendances
```bash
# Cloner le projet (si nécessaire)
git clone <repository-url>
cd BACKEND-APP-DE-SUIVI-DE-SERIES-FILMS

# Installer les dépendances npm
npm install
```

### Étape 2 : Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp env.example .env

# Les valeurs par défaut fonctionnent pour le développement
# Vous pouvez modifier .env si nécessaire
```

### Étape 3 : Démarrage de MongoDB
```bash
# Ouvrir un terminal et se déplacer dans le dossier mongodb
cd src/data/v2/mongodb

# Démarrer MongoDB avec le dossier local comme base de données
mongod --dbpath .

# Laisser ce terminal ouvert - MongoDB doit rester en cours d'exécution
```

### Étape 4 : Insertion des données de test
```bash
# Ouvrir un NOUVEAU terminal dans le dossier racine du projet
cd BACKEND-APP-DE-SUIVI-DE-SERIES-FILMS

# Insérer les données de test dans MongoDB
npm run setup
```

### Étape 5 : Démarrage du serveur API
```bash
# Dans le même terminal (ou un nouveau)
npm run dev

# Le serveur démarre sur le port 3000
```

### Étape 6 : Vérification
```bash
# Le serveur sera accessible sur :
# HTTP: http://localhost:3000
# Documentation Swagger v2: http://localhost:3000/docs/v2
# Documentation Swagger v1: http://localhost:3000/docs/v1
```

## Structure des Terminaux

Pour faire fonctionner le projet, vous devez avoir **3 terminaux ouverts** :

### Terminal 1 - MongoDB
```bash
cd src/data/v2/mongodb
mongod --dbpath .
# Laisser ouvert en permanence
```

### Terminal 2 - Données (une seule fois)
```bash
cd BACKEND-APP-DE-SUIVI-DE-SERIES-FILMS
npm run setup
# Fermer après exécution
```

### Terminal 3 - Serveur API
```bash
cd BACKEND-APP-DE-SUIVI-DE-SERIES-FILMS
npm run dev
# Laisser ouvert en permanence
```

## Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier que le port 27017 n'est pas utilisé
netstat -an | grep 27017

# Vérifier les permissions du dossier mongodb
ls -la src/data/v2/mongodb/
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
ps aux | grep mongod

# Tester la connexion
mongosh mongodb://localhost:27017/media_dev
```

### Port 3000 déjà utilisé
```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000

# Arrêter le processus si nécessaire
kill -9 <PID>
```

### Données non insérées
```bash
# Vérifier que MongoDB est démarré
# Relancer l'insertion des données
npm run setup

# Vérifier les données dans MongoDB
mongosh mongodb://localhost:27017/media_dev
db.users.find().count()
db.movies.find().count()
```

## Versions de l'API

### **v1 (DEPRECATED)**
- **Base de données** : Fichier JSON (`src/data/v1/db.json`)
- **Endpoints** : `/api/v1/` ou `/api/` (legacy)
- **Fonctionnalités** : CRUD basique, logging Winston
- **Collection Postman** : `src/data/v1/420-514-MV-COLLECTE-TP-01.postman_collection.json`

### **v2 (RECOMMANDÉE)**
- **Base de données** : MongoDB
- **Endpoints** : `/api/v2/`
- **Fonctionnalités** : JWT auth, agrégations, pagination, filtres avancés
- **Collection Postman** : `src/data/v2/420-514-MV-COLLECTE-TP-02.postman_collection.json`

## API Endpoints

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

## **Documentation API**

- **Swagger v1** : `http://localhost:3000/api-docs/v1` (dépréciée)
- **Swagger v2** : `http://localhost:3000/api-docs/v2` (recommandée)

### **Exemples de routes avec pagination**

#### **Films (Movies)**
```bash
# Récupérer tous les films (page 1, 20 par défaut)
GET http://localhost:3000/api/v2/movies

# Pagination personnalisée
GET http://localhost:3000/api/v2/movies?page=2&limit=50

# Filtrage par titre
GET http://localhost:3000/api/v2/movies?title=Avengers

# Filtrage par genre et année
GET http://localhost:3000/api/v2/movies?genre=Action&minYear=2020&maxYear=2024

# Filtrage par durée
GET http://localhost:3000/api/v2/movies?minDuration=90&maxDuration=180

# Combinaison de filtres
GET http://localhost:3000/api/v2/movies?title=Marvel&genre=Action&page=1&limit=10
```

#### **Séries (Series)**
```bash
# Récupérer toutes les séries
GET http://localhost:3000/api/v2/series

# Filtrage par statut
GET http://localhost:3000/api/v2/series?status=ended

# Filtrage par genre et pagination
GET http://localhost:3000/api/v2/series?genre=Drama&page=2&limit=15
```

#### **Épisodes**
```bash
# Récupérer les épisodes d'une saison
GET http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}/episodes

# Filtrage par durée
GET http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}/episodes?minDuration=40&maxDuration=60

# Avec pagination
GET http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}/episodes?page=1&limit=10
```

### **Exemples d'authentification**

#### **Inscription**
```bash
POST http://localhost:3000/api/v2/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### **Connexion**
```bash
POST http://localhost:3000/api/v2/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### **Utilisation du token**
```bash
# Ajouter le token dans l'en-tête Authorization
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Exemple : Récupérer le profil utilisateur
GET http://localhost:3000/api/v2/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Exemples de notes (Ratings)**

#### **Créer une note**
```bash
POST http://localhost:3000/api/v2/ratings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "target": "movie",
  "targetId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "score": 8.5,
  "review": "Excellent film avec de superbes effets visuels!"
}
```

#### **Récupérer la note moyenne d'un film**
```bash
GET http://localhost:3000/api/v2/ratings/avg/movie/64f1a2b3c4d5e6f7g8h9i0j1
```

#### **Récupérer la note moyenne d'une série**
```bash
GET http://localhost:3000/api/v2/ratings/avg/series/64f1a2b3c4d5e6f7g8h9i0j2
```

### **Exemples d'opérations CRUD (Admin)**

#### **Créer un film**
```bash
POST http://localhost:3000/api/v2/movies
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "The Avengers",
  "genres": ["Action", "Adventure", "Sci-Fi"],
  "synopsis": "Earth's mightiest heroes must come together...",
  "releaseDate": "2012-05-04",
  "durationMin": 143
}
```

#### **Créer une série**
```bash
POST http://localhost:3000/api/v2/series
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Breaking Bad",
  "genres": ["Drama", "Crime", "Thriller"],
  "status": "ended"
}
```

#### **Récupérer les saisons d'une série**
```bash
GET http://localhost:3000/api/v2/series/{seriesId}/seasons?page=1&limit=20
```

#### **Récupérer une saison spécifique**
```bash
GET http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}
```

#### **Créer une saison**
```bash
POST http://localhost:3000/api/v2/series/{seriesId}/seasons
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "seasonNo": 1,
  "episodes": 10
}
```

#### **Récupérer un épisode spécifique**
```bash
GET http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}/episodes/{episodeId}
```

#### **Créer un épisode**
```bash
POST http://localhost:3000/api/v2/series/{seriesId}/seasons/{seasonId}/episodes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "epNo": 1,
  "title": "Pilot",
  "durationMin": 58
}
```

## Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env
MONGO_URI=mongodb://localhost:27017/media_dev
JWT_SECRET=your-super-secret-jwt-key
```

### Configuration par défaut
Le projet utilise le package `config` pour la configuration. Les fichiers de configuration se trouvent dans le dossier `config/`.

### Configuration HTTP
- **HTTP uniquement** : Port 3000
- **Configuration simple** : Pas de certificats SSL requis

## Tests avec Postman

### Importation de la Collection

1. **Ouvrir Postman**
2. **Importer la collection :**
   - Cliquer sur "Import"
   - Sélectionner le fichier : `src/data/v1/420-514-MV-COLLECTE-TP-01.postman_collection.json`

### Structure de la Collection

La collection est organisée en deux dossiers :

#### **tests**
Contient des exemples de requêtes pour tester les fonctionnalités :

- **GET /medias** - Récupérer tous les médias
- **GET /medias?type=Serie&genre=drama&year=2020** - Filtrage des médias
- **POST /films** - Créer un film (exemple : "The Dark Knight")
- **POST /series** - Créer une série (exemple : "Breaking Bad")
- **POST /seasons** - Ajouter une saison
- **POST /episodes** - Ajouter un épisode
- **PATCH /episodes/:id** - Marquer un épisode comme vu
- **Tests de validation** - Exemples d'erreurs (titre manquant, données invalides)

#### **routes**
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

## Fonctionnalités Principales

- **Gestion des médias** - Films et séries avec métadonnées complètes
- **Organisation hiérarchique** - Séries → Saisons → Épisodes
- **Suivi de progression** - Marquer les épisodes comme vus
- **Validation robuste** - Contrôle des données avec regex
- **Journalisation complète** - Logs détaillés des opérations
- **Filtrage avancé** - Recherche par type, genre, année, statut
- **Gestion des utilisateurs** - Système de favoris et rôles

## Base de Données

Les données sont stockées dans `src/data/v1/db.json` et incluent :
- Utilisateurs avec rôles (admin/user)
- Films et séries avec métadonnées
- Saisons et épisodes organisés hiérarchiquement
- Système de favoris par utilisateur

## Sécurité et Validation

- **Validation des entrées** avec expressions régulières
- **Contrôle des rôles** pour les opérations sensibles
- **Gestion d'erreurs** centralisée
- **Logs de sécurité** pour le suivi des opérations

---

*Ce projet sert de fondation pour l'intégration future d'une base de données NoSQL (MongoDB), d'analyses périodiques de données et de tests de sécurité avancés.*

---

> ⚠️ This repository is a work in progress. AWS deployment is currently in the testing phase.