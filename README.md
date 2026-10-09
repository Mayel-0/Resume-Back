# mael-llado.com — API Backend

> API REST du portfolio personnel de **Maël Llado**, développeur Full Stack basé à Bordeaux.
> Accessible à l'adresse : [mael-llado.com/api](https://mael-llado.com/api)

Ce dépôt est la **partie backend** d'un projet découpé en trois repos distincts :

| Repo                        | Rôle                        | URL                    |
| --------------------------- | --------------------------- | ---------------------- |
| Resume-Front                | Interface utilisateur React | `mael-llado.com`       |
| **Resume-Back** _(ce repo)_ | API REST Node.js / Express  | `mael-llado.com/api`   |
| Resume-Admin                | Panneau d'administration    | `admin.mael-llado.com` |

### Architecture globale

```
Client
  │
  ▼
Cloudflare  ◄─── CDN, protection DDoS, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse proxy vers les conteneurs Docker
  │         ├── mael-llado.com        → conteneur front  (build Vite servi par Nginx)
  │         ├── mael-llado.com/api    → conteneur back   (Node.js)  ◄── ce repo
  │         └── admin.mael-llado.com  → conteneur admin  (build Vite servi par Nginx)
  │
  └── conteneur db ─── PostgreSQL 17, données dans un volume Docker
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur.
> Les conteneurs n'écoutent que sur `127.0.0.1` : seul Nginx peut les joindre.

---

## Présentation

API REST écrite en **TypeScript** (mode `strict`) avec **Node.js** et **Express 5**. Elle expose les données du portfolio stockées en base **PostgreSQL** via **Drizzle ORM**, valide tout ce qu'elle reçoit avec **Zod**, et protège les routes d'administration par une connexion en deux étapes.

Elle sert deux types de consommateurs :

- Le **frontend public** (`mael-llado.com`) — lecture seule, toutes les données du portfolio
- Le **panneau admin** (`admin.mael-llado.com`) — lecture/écriture, routes protégées

Elle sert aussi les fichiers statiques du site : images des projets, icônes et CV (`/images`, `/svg`, `/documents`).

---

## Stack technique

| Catégorie             | Technologie          | Version |
| --------------------- | -------------------- | ------- |
| Langage               | TypeScript (strict)  | 7       |
| Runtime               | Node.js (ESM)        | 24      |
| Framework             | Express              | 5       |
| ORM                   | Drizzle ORM          | 0.45    |
| Validation            | Zod + drizzle-zod    | 4       |
| Base de données       | PostgreSQL (`pg`)    | 17      |
| Authentification      | JSON Web Token       | 9       |
| Hash de mots de passe | bcryptjs             | 3       |
| E-mail (code OTP)     | Nodemailer           | 10      |
| Rate limiting         | express-rate-limit   | 8       |
| Dev server            | tsx (`tsx watch`)    | 4       |
| Schéma → base         | Drizzle Kit          | 0.31    |
| Conteneurisation      | Docker (multi-stage) | —       |

---

## Architecture du projet

```
Resume-Back/
├── public/                  # Fichiers servis par l'API (images, SVG, CV en PDF)
├── src/
│   ├── server.ts            # Point d'entrée — démarre le serveur HTTP
│   ├── app.ts               # Application Express : middlewares et montage des routes
│   ├── env.ts               # Variables d'environnement validées au démarrage
│   ├── db/
│   │   ├── schema.ts        # Tables PostgreSQL (source de vérité des types)
│   │   ├── index.ts         # Connexion à la base via pg + Drizzle
│   │   └── seed.ts          # Données initiales pour un environnement local
│   ├── models/              # Un fichier par entité : types + schémas de validation
│   ├── controllers/         # Logique des routes publiques et de l'authentification
│   ├── routes/              # Déclaration des routes — publiques, auth, admin
│   ├── middleware/          # Vérification du JWT, gestion des erreurs
│   ├── lib/
│   │   ├── crud.ts          # Les 4 routes d'administration d'une ressource
│   │   ├── http.ts          # Réponses d'erreur communes (400 / 500)
│   │   └── mailer.ts        # Envoi du code de connexion
│   └── types/               # Extension des types Express (req.admin)
├── drizzle.config.ts        # Configuration Drizzle Kit
├── tsconfig.json
├── Dockerfile
└── .env.example             # Modèle des variables d'environnement
```

### Du schéma à la route : un seul type

Le schéma Drizzle est la source de vérité. Les types et la validation en sont déduits, rien n'est écrit deux fois :

```
src/db/schema.ts                    table "projects"
        │
        ▼
src/models/project.ts               type Project        (typeof projects.$inferSelect)
        │                           createProjectSchema (drizzle-zod)
        │                           updateProjectSchema (tous les champs facultatifs)
        ▼
src/routes/admin.route.ts           crudRoutes({ createSchema, updateSchema, create, update… })
```

`crudRoutes` génère `GET`, `POST`, `PATCH` et `DELETE` pour une ressource. Les fonctions `create` et `update` reçoivent le type produit par les schémas Zod : si un schéma ne correspond plus aux colonnes de la table, le projet ne compile pas.

### Validation des entrées

Le corps de chaque requête d'écriture est validé avant d'atteindre la base :

- un champ inconnu est **ignoré** (impossible d'écrire dans `id` ou `createdAt`) ;
- un champ invalide renvoie une **erreur 400** lisible, en français :

```json
{ "error": "Données invalides — visibility : Option invalide : une valeur parmi \"Public\"|\"Privé\" attendue" }
```

---

## Routes

### Publiques (lecture seule)

| Route                         | Contenu                              |
| ----------------------------- | ------------------------------------ |
| `GET /api/profil`             | Présentation du hero                 |
| `GET /api/socials`            | Liens de contact                     |
| `GET /api/timeline`           | Étapes du parcours                   |
| `GET /api/sections`           | Blocs de texte libres                |
| `GET /api/briefs`             | Bloc « En bref »                     |
| `GET /api/skill-categories`   | Catégories de compétences            |
| `GET /api/skill-items`        | Compétences                          |
| `GET /api/projects`           | Projets                              |
| `GET /api/project-tags`       | Étiquettes des projets               |
| `GET /api/project-tech-stack` | Langages et frameworks des projets   |
| `GET /health`                 | État du serveur (utilisé par Docker) |

### Administration (session requise)

Chaque ressource ci-dessus dispose de ses routes sous `/api/admin` :

| Méthode  | Route                       | Action                       |
| -------- | --------------------------- | ---------------------------- |
| `GET`    | `/api/admin/:ressource`     | Lister                       |
| `POST`   | `/api/admin/:ressource`     | Créer                        |
| `PATCH`  | `/api/admin/:ressource/:id` | Modifier                     |
| `DELETE` | `/api/admin/:ressource/:id` | Supprimer                    |
| `PATCH`  | `/api/admin/profil`         | Modifier le profil (unique)  |

---

## Authentification

La connexion se fait en **deux étapes** : mot de passe, puis code à usage unique envoyé par e-mail. La session est un **JWT** stocké dans un **cookie `HttpOnly`**, inaccessible au JavaScript du navigateur.

```
POST /api/auth/login        (email + mot de passe)
  │   vérification bcryptjs
  │   génération d'un code à 6 chiffres, valable 10 minutes
  ▼
E-mail envoyé à l'administrateur
  │
POST /api/auth/verify-otp   (email + code)
  │   le code est marqué comme utilisé
  ▼
res.cookie("token", jwt, { httpOnly, secure, sameSite, domain })
  │
Requêtes suivantes vers /api/admin/*
  │   le navigateur envoie le cookie (credentials: "include")
  ▼
verifyToken → signature et contenu du jeton vérifiés → req.admin
```

| Méthode | Route                  | Description                                 |
| ------- | ---------------------- | ------------------------------------------- |
| `POST`  | `/api/auth/login`      | Vérifie les identifiants, envoie le code    |
| `POST`  | `/api/auth/verify-otp` | Vérifie le code, pose le cookie de session  |
| `POST`  | `/api/auth/logout`     | Efface le cookie                            |
| `GET`   | `/api/auth/me`         | Indique si la session est valide            |

### Configuration du cookie

```ts
const sessionCookie: CookieOptions = {
  httpOnly: true, // inaccessible au JS — protection XSS
  secure: true, // HTTPS uniquement
  sameSite: "lax",
  domain: ".mael-llado.com", // valide sur tous les sous-domaines
};
```

> `domain: ".mael-llado.com"` rend le cookie valide à la fois pour l'API (`mael-llado.com`) et pour le panneau admin (`admin.mael-llado.com`). La session dure 1 heure.

### Protection contre la force brute

`/api/auth/login` et `/api/auth/verify-otp` sont limitées par **`express-rate-limit`** : 10 tentatives par IP sur 15 minutes.

---

## Variables d'environnement

Créer un fichier `.env` à la racine (modèle : `.env.example`) :

```dotenv
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/portfolio_db
JWT_SECRET=une-longue-chaine-aleatoire
SMTP_USER=
SMTP_PASS=
```

| Variable       | Obligatoire | Description                                             |
| -------------- | ----------- | ------------------------------------------------------- |
| `DATABASE_URL` | oui         | URL de connexion PostgreSQL                             |
| `JWT_SECRET`   | oui         | Clé de signature des jetons de session                  |
| `PORT`         | non         | Port d'écoute (défaut : `3000`)                         |
| `SMTP_USER`    | non         | Compte Gmail qui envoie le code de connexion            |
| `SMTP_PASS`    | non         | Mot de passe d'application Gmail                        |

> Les variables sont validées au démarrage (`src/env.ts`) : s'il manque une variable obligatoire, le serveur s'arrête immédiatement en indiquant laquelle.
> Sans `SMTP_*`, l'API démarre mais la connexion au panneau admin est impossible.
> Les fichiers `.env` ne sont jamais commités.

---

## Installation & développement

```bash
git clone https://github.com/Mayel-0/Resume-Back.git
cd Resume-Back
npm install

# Configurer l'environnement
cp .env.example .env

# Créer les tables à partir du schéma
npm run db:push

# (Optionnel) Remplir la base avec des données d'exemple
npm run seed

# Lancer le serveur avec rechargement automatique
npm run dev
```

## Scripts disponibles

| Commande            | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Serveur de développement (`tsx watch`)                 |
| `npm run build`     | Compilation TypeScript → `dist/`                       |
| `npm run start`     | Lance la version compilée (`node dist/server.js`)      |
| `npm run typecheck` | Vérification des types sans compiler                   |
| `npm run db:push`   | Synchronise le schéma Drizzle avec la base             |
| `npm run seed`      | Remplit la base avec des données d'exemple             |

---

## Déploiement

L'API tourne dans un **conteneur Docker**. Le `Dockerfile` procède en deux étapes : compilation TypeScript, puis image finale ne contenant que le code compilé et les dépendances de production, exécutée par un utilisateur non-root.

```bash
docker build -t resume-back .
docker run -d --env-file .env -p 127.0.0.1:3000:3000 resume-back
```

En production, un fichier `docker-compose.yml` lance ensemble la base PostgreSQL, l'API, le site et le panneau admin. L'API y reçoit son `DATABASE_URL` pointant vers le conteneur `db`, et ne démarre qu'une fois la base prête. Un `HEALTHCHECK` interroge `/health` toutes les 30 secondes.

Le Nginx du serveur relaie `/api`, `/images`, `/svg` et `/documents` vers le conteneur :

```nginx
location /api {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Points de configuration importants

**`trust proxy`** — obligatoire derrière Cloudflare et Nginx pour que le rate limiting identifie l'IP réelle du client :

```ts
app.set("trust proxy", 1);
```

**CORS** — une seule configuration, avec `credentials: true` pour que le navigateur accepte d'envoyer le cookie de session depuis le panneau admin :

```ts
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mael-llado.com",
      "https://www.mael-llado.com",
      "https://admin.mael-llado.com",
    ],
    credentials: true,
  }),
);
```

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
