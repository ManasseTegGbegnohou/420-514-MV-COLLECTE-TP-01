# Backend d'Application de Suivi de Séries et Films
> ⚠️Projet en développement 

API RESTful modulaire, extensible et sécurisée qui permet :
- **Gestion des médias** : Création et gestion de films et séries
- **Organisation hiérarchique** : Séries → Saisons → Épisodes
- **Suivi de progression** : Épisodes vus/non vus
- **Validation des données** : Protection contre erreurs et abus
- **Persistance** : Base de données MongoDB avec données de test
- **Documentation** : Swagger interactif + collection Postman

## Prérequis

- **Node.js** (v16+) - [Télécharger](https://nodejs.org/)
- **MongoDB Community Server** - [Télécharger](https://www.mongodb.com/try/download/community)
- **MongoDB Shell (mongosh)** - [Télécharger](https://www.mongodb.com/try/download/shell)

## Installation Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer MongoDB (Terminal 1)
cd src/data/v2/mongodb
mongod --dbpath .

# 3. Insérer les données de test (Terminal 2)
cd BACKEND-APP-DE-SUIVI-DE-SERIES-FILMS
npm run setup

# 4. Démarrer le serveur (Terminal 3)
npm run dev
```

## Accès

- **API**: http://localhost:3000
- **Documentation Swagger v2**: http://localhost:3000/docs/v2
- **Documentation Swagger v1**: http://localhost:3000/docs/v1

> **Pour plus de détails sur l'API, consultez la documentation Swagger interactive !**

## Structure des Terminaux

**3 terminaux requis :**

1. **MongoDB** : `cd src/data/v2/mongodb && mongod --dbpath .`
2. **Données** (une fois) : `npm run setup`
3. **Serveur** : `npm run dev`

## Tests

Collection Postman disponible : `src/data/v2/420-514-MV-COLLECTE-TP-02.postman_collection.json`

---

> ⚠️Projet en développement 