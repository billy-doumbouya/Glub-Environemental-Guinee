# Module de veille intelligente des appels à projets

Module autonome, pensé pour se greffer sur ton backend Node/Express + MongoDB existant.
Aucune dépendance à tes modèles actuels — tu branches juste les routes et l'auth.

## 1. Installation

```bash
npm install mongoose axios rss-parser cheerio string-similarity node-cron @anthropic-ai/sdk
```

## 2. Variables d'environnement

```
ANTHROPIC_API_KEY=sk-ant-...
```

## 3. Intégration dans ton app existante

Dans ton `app.js` / `server.js` :

```js
const opportunitiesRoutes = require('./funding-radar-module/routes/opportunities.routes');
app.use('/api', opportunitiesRoutes);

require('./funding-radar-module/jobs/scheduler').start();
```

**Auth admin** : ouvre `routes/opportunities.routes.js` et branche ton middleware
d'authentification existant (ligne commentée `requireAdmin`).

**Connexion Mongo** : les modèles utilisent `mongoose.model(...)` — ils se connecteront
automatiquement à la connexion Mongoose déjà initialisée dans ton app (pas besoin de
dupliquer la connexion).

## 4. Avant le premier lancement

1. Créer au moins une `Source` en base (via un script ou un futur écran admin) :
```js
await Source.create({
  name: "Exemple Fondation",
  type: "rss",
  url: "https://exemple.org/appels-a-projets/feed",
});
```
2. Configurer le `NGOProfile` (thématiques, pays, budget habituel...) — sans ça,
   le pipeline refuse de scorer (erreur explicite).
3. Lancer manuellement une première fois : `POST /api/opportunities/run-now`.

## 5. Endpoints exposés

| Méthode | Route | Usage |
|---|---|---|
| GET | /api/opportunities | Liste filtrable (thème, pays, score, statut...) pour le dashboard |
| GET | /api/opportunities/dashboard/summary | Compteurs pour la vue synthétique |
| GET | /api/opportunities/:id | Détail d'une opportunité |
| PATCH | /api/opportunities/:id/status | Favori / traité / masqué |
| POST | /api/opportunities/run-now | Déclenche la veille manuellement |
| GET/PUT | /api/ngo-profile | Consulter/modifier le profil stratégique |

## 6. Frontend (dossier `frontend/`)

5 pages React, autonomes, avec leur propre feuille de style (`styles/funding-radar.css`,
pas de dépendance à un framework CSS particulier — s'intègre à n'importe quel projet React) :

| Fichier | Page |
|---|---|
| `pages/DashboardPage.jsx` | Vue synthétique (compteurs, top opportunités, deadlines) |
| `pages/OpportunitiesListPage.jsx` | Liste filtrable (thème, pays, statut, score, recherche texte) |
| `pages/OpportunityDetailPage.jsx` | Détail complet d'un appel + actions (favori/traité/masqué) |
| `pages/SourcesPage.jsx` | CRUD des sources de veille, avec avertissement explicite sur le HTML |
| `pages/NgoProfilePage.jsx` | Édition du profil ONG et des pondérations de scoring |
| `FundingRadarApp.jsx` | Point d'entrée qui assemble tout (routage simple à état — remplace par `react-router` si déjà utilisé dans ton app) |

**Installation** : copier `frontend/src/*` dans ton app React existante (fusionner avec ton
arbo `src/` actuelle), puis importer `<FundingRadarApp />` où tu veux l'afficher (ex: une route `/veille`).

**Sur le scraping HTML** : le formulaire d'ajout de source avertit l'admin que les sélecteurs
CSS doivent être vérifiés manuellement sur le site réel — voir point 7 ci-dessous.

## 7. Ce qui reste à faire côté toi

- Le branchement réel des notifications (`notificationService.js` a un point d'intégration `dispatchNotifications`, à relier à ton système d'email/notif existant).
- **Sources HTML réelles** : donne-moi les URLs des sites que tu veux suivre pour que j'inspecte leur structure et écrive des sélecteurs qui marchent vraiment (voir §8). En attendant, démarre avec des sources RSS/API.
- Brancher le middleware d'auth admin sur les routes (`routes/opportunities.routes.js`).

## 8. Important — sur la fiabilité du scraping HTML

Le moteur de scraping (`collectorService.js`) est générique et fonctionnel, mais il a besoin
de **sélecteurs CSS propres à chaque site**. Je ne les ai pas inventés — le formulaire
`SourcesPage.jsx` demande à l'admin de les renseigner et prévient explicitement que ça ne
marche que si le site a été inspecté au préalable. Pour des sources 100% fiables sans configuration :
privilégie RSS et API officielles, qui sont génériques et déjà fonctionnelles telles quelles.

## 7. Notes importantes

- La déduplication compare hash exact, URL, puis similarité de titre (seuil 85%) — ajustable dans `deduplicationService.js`.
- Le scoring est **déterministe**, pas décidé par l'IA (conforme au §8 du doc de conception) — l'IA ne fait qu'extraire des champs et donner un avis d'éligibilité indicatif.
- Chaque opportunité déjà en base n'est jamais ré-analysée par l'IA (maîtrise des coûts).
