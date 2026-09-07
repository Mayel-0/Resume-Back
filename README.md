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
Cloudflare  ◄─── CDN, DDoS protection, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse Proxy
  │         ├── mael-llado.com        → Frontend (dist Vite statique)
  │         ├── mael-llado.com/api    → Backend Node.js  ◄── ce repo
  │         └── admin.mael-llado.com  → Panel Admin
  │
  └── PostgreSQL  ◄─── Toutes les données (textes, projets, images, documents)
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur
> (un `ping mael-llado.com` renvoie une IP Cloudflare, pas l'IP Oracle).

---

## Backend — Resume-Back

### Présentation

API REST construite avec **Node.js** et **Express 5**. Elle expose les données du portfolio stockées en base **PostgreSQL** via **Drizzle ORM**, et sécurise les routes d'administration avec une authentification **JWT**.

Elle sert deux types de consommateurs :

- Le **frontend public** (`mael-llado.com`) — lecture seule, toutes les données du portfolio
- Le **panneau admin** (`admin.mael-llado.com`) — lecture/écriture, routes protégées par JWT

---

## Stack technique

| Catégorie               | Technologie        | Version                  |
| ----------------------- | ------------------ | ------------------------ |
| Runtime                 | Node.js            | ESM (`"type": "module"`) |
| Framework               | Express            | 5                        |
| ORM                     | Drizzle ORM        | 0.45                     |
| Base de données         | PostgreSQL         | via `pg` 8.23            |
| Authentification        | JSON Web Token     | 9                        |
| Hash de mots de passe   | bcryptjs           | 3                        |
| Variables d'env         | dotenv             | 17                       |
| CORS                    | cors               | 2.8                      |
| Rate limiting           | express-rate-limit | 7                        |
| Cookies                 | cookie-parser      | 1.4                      |
| Dev server              | Nodemon            | 3                        |
| Migration / Push schema | Drizzle Kit        | 0.31                     |
| TypeScript (tooling)    | TypeScript + tsx   | 7 / 4.23                 |

> Le projet tourne en **ESM natif** (`"type": "module"` dans `package.json`).
> Le schéma Drizzle est écrit en **TypeScript** (`.ts`), le reste de l'application en **JavaScript**.

---

## Architecture du projet

```
Resume-Back/
├── public/                  # Assets servis statiquement (images, PDF CV…)
├── src/
│   ├── db/
│   │   ├── schema.ts        # Définition des tables Drizzle ORM (PostgreSQL)
│   │   ├── seed.js          # Script de peuplement initial (partiellement à jour)
│   │   └── index.js         # Connexion à la base via pg + Drizzle
│   ├── controllers/         # Logique métier — un fichier par ressource
│   ├── routes/              # Définition des routes Express — un fichier par ressource
│   └── middleware/          # Middlewares (auth JWT, gestion d'erreurs, etc.)
├── drizzle/                 # Migrations générées par Drizzle Kit
├── drizzle.config.ts        # Configuration Drizzle Kit (schéma, dialect, connexion)
├── index.js                 # Point d'entrée — instanciation Express, montage des routes
├── .env.example             # Template des variables d'environnement
└── package.json
```

### Pattern MVC

L'application suit une architecture **MVC** stricte, séparant clairement les responsabilités :

```
Requête HTTP
  │
  ▼
Route (src/routes/)
  │   Déclare le verbe HTTP et le chemin
  │   Applique les middlewares (ex: vérification JWT)
  ▼
Controller (src/controllers/)
  │   Contient la logique métier
  │   Interroge la base via Drizzle ORM
  │   Retourne la réponse JSON
  ▼
Middleware (src/middleware/)
    Authentification JWT, gestion centralisée des erreurs
```

---

## Base de données

La base **PostgreSQL** est gérée via **Drizzle ORM** — un ORM TypeScript-first léger qui génère du SQL typé sans abstraction lourde.

### Workflow Drizzle

```bash
# Modifier le schéma dans src/db/schema.ts
# puis pousser les changements directement en base (sans fichier de migration)
npm run db:push

# Pour générer des fichiers de migration dans /drizzle/
# drizzle-kit generate  (non scripté, utilisable manuellement)
```

> `db:push` est utilisé en développement pour synchroniser rapidement le schéma.
> Les fichiers de migration dans `/drizzle/` peuvent être utilisés pour un déploiement plus contrôlé.

### Seed

```bash
npm run seed
# → node --experimental-vm-modules src/db/seed.js
```

> ⚠️ Le fichier `seed.js` n'est pas entièrement à jour par rapport au schéma actuel.
> À utiliser uniquement pour initialiser un environnement de développement local,
> et à compléter manuellement si nécessaire.

---

## Authentification

Les routes d'administration sont protégées par **JSON Web Token (JWT)** stocké dans un **cookie `HttpOnly`** — inaccessible au JavaScript du navigateur, ce qui protège contre les attaques XSS.

### Flux de connexion

```
POST /api/auth/login  (email + password)
  │
  ▼
Vérification bcryptjs + jwt.sign()
  │
  ▼
res.cookie("token", jwt, { httpOnly, secure, sameSite, domain })
  │  → le navigateur stocke le cookie automatiquement
  ▼
Requêtes suivantes vers /api/admin/*
  │  → le navigateur envoie le cookie automatiquement (credentials: "include")
  ▼
verifyToken middleware → jwt.verify() → req.admin = decoded
```

### Configuration du cookie

```js
res.cookie("token", token, {
  httpOnly: true, // inaccessible au JS — protection XSS
  secure: true, // HTTPS uniquement
  sameSite: "lax", // compatible cross-subdomain
  domain: ".mael-llado.com", // valide sur tous les sous-domaines
  maxAge: 60 * 60 * 1000, // 1h — cohérent avec expiresIn JWT
});
```

> `SameSite: "lax"` est nécessaire car le panel admin (`admin.mael-llado.com`) fait des requêtes vers l'API (`mael-llado.com/api`) — deux sous-domaines différents.
> `domain: ".mael-llado.com"` (avec le point) rend le cookie valide sur tous les sous-domaines.

### Routes auth

| Méthode | Route              | Description                       |
| ------- | ------------------ | --------------------------------- |
| `POST`  | `/api/auth/login`  | Connexion — pose le cookie JWT    |
| `POST`  | `/api/auth/logout` | Déconnexion — efface le cookie    |
| `GET`   | `/api/auth/me`     | Vérifie la validité de la session |

### Protection rate limiting

La route `/api/auth/login` est protégée par **`express-rate-limit`** :

- Maximum **10 tentatives** par IP sur une fenêtre de **15 minutes**
- Protège contre les attaques par force brute

---

## Variables d'environnement

Créer un fichier `.env` à la racine avant de lancer le projet :

```dotenv
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db
JWT_SECRET=votre_secret_jwt
```

| Variable       | Description                                               |
| -------------- | --------------------------------------------------------- |
| `PORT`         | Port d'écoute du serveur Express (défaut : `5000`)        |
| `DATABASE_URL` | URL de connexion PostgreSQL complète                      |
| `JWT_SECRET`   | Clé secrète pour la signature/vérification des tokens JWT |

> En production, le fichier `.env.production` est utilisé.
> Ne jamais committer ces fichiers — ils sont dans le `.gitignore`.
> Un `.env.example` est disponible à la racine comme référence.

---

## Installation & développement

```bash
# Cloner le repo
git clone https://github.com/Mayel-0/Resume-Back.git
cd Resume-Back

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# puis renseigner DATABASE_URL, JWT_SECRET, PORT

# Pousser le schéma en base
npm run db:push

# (Optionnel) Peupler la base avec des données initiales
npm run seed

# Lancer le serveur de développement
npm run dev
```

## Scripts disponibles

| Commande          | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec Nodemon (rechargement auto) |
| `npm run start`   | Lancer le serveur en production                           |
| `npm run db:push` | Synchroniser le schéma Drizzle avec la base PostgreSQL    |
| `npm run seed`    | Peupler la base avec des données initiales                |

---

## Déploiement

Le serveur tourne en production sur **Oracle Cloud (Ubuntu)**, géré par **PM2** et exposé via **Nginx** en reverse proxy sur `mael-llado.com/api`.

```bash
# Build non nécessaire — Node.js natif ESM
npm run start

# Ou via PM2 pour la gestion du processus en production
pm2 start index.js --name resume-back
pm2 save
```

Nginx route le trafic `/api` vers le port local du serveur Express, en transmettant les cookies :

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Cookie $http_cookie;   # transmet les cookies au back
    proxy_pass_header Set-Cookie;           # laisse passer Set-Cookie vers le client
}
```

### Points de configuration importants

**`trust proxy`** — obligatoire derrière Cloudflare/Nginx pour que `express-rate-limit` identifie correctement l'IP du client (sinon il voit l'IP de Cloudflare) :

```js
app.set("trust proxy", 1);
```

**CORS** — une seule configuration unifiée avec `credentials: true`, obligatoire pour que le navigateur accepte d'envoyer les cookies sur les requêtes cross-origin :

```js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mael-llado.com",
      "https://admin.mael-llado.com",
    ],
    credentials: true, // obligatoire pour les cookies HttpOnly
  }),
);
```

> ⚠️ Ne jamais déclarer deux `app.use(cors(...))` — le second écrase les headers du premier et `credentials: true` ne serait plus envoyé au navigateur.

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
