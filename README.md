# 🏀 BasketLearn — LMS E-Learning Basketball

Plateforme e-learning dédiée au basketball, développée avec la stack **MERN** dans le cadre du projet Epitech CORELAB.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)

---

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd W-WEB-201-PAR-2-1-corelab-8

# 2. Installer les dépendances client
cd client && npm install && cd ..

# 3. Installer les dépendances serveur
cd server && npm install && cd ..
```

---

## Variables d'environnement

```bash
cp server/.env.example server/.env
```

| Variable             | Description                       | Valeur par défaut                       |
|----------------------|-----------------------------------|-----------------------------------------|
| `PORT`               | Port du serveur API               | `4242`                                  |
| `MONGO_URI`          | URI de connexion MongoDB          | `mongodb://127.0.0.1:27017/corelab_lms` |
| `JWT_SECRET`         | Clé secrète JWT (**à changer !**) | `change_me`                             |
| `JWT_EXPIRES_IN`     | Durée de validité du token        | `1d`                                    |
| `BCRYPT_SALT_ROUNDS` | Facteur de coût bcrypt (≥ 10)     | `10`                                    |
| `CLIENT_URL`         | URL du frontend (CORS)            | `http://localhost:3000`                 |

---

## Lancer le projet

### 1. Peupler la base de données (première fois)

```bash
cd server && npm run seed
```

Crée les cours, leçons, quiz et deux comptes de démonstration :

| Rôle     | Email                    | Mot de passe |
|----------|--------------------------|--------------|
| Admin    | `admin@basketball.fr`    | `admin123`   |
| Étudiant | `etudiant@basketball.fr` | `basket123`  |

### 2. Démarrer le serveur (port 4242)

```bash
cd server && npm run dev
```

### 3. Démarrer le client (port 3000)

```bash
cd client && npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
.
├── client/               # React + Vite + Bootstrap 5
│   └── src/
│       ├── pages/        # LoginPage, StudentDashboard, CoursesPage, CoursePage,
│       │                 # LessonPage, QuizPage, QuizResultPage
│       ├── components/   # Navbar, CourseCard, ProgressBar, LessonItem,
│       │                 # QuizQuestion, ScoreDisplay, PrivateRoute
│       ├── services/     # api.js (appels API + fallback mock), auth.js
│       ├── hooks/        # useAuth (AuthContext)
│       └── utils/        # date.js
│
└── server/               # Express + MongoDB (Mongoose)
    └── src/
        ├── models/       # User, Course, Lesson, Quiz, Progress
        ├── routes/       # auth, courses, lessons, quizzes, admin
        ├── middleware/   # auth (JWT), validate (Zod)
        ├── index.js      # Point d'entrée Express
        └── seed.js       # Script de peuplement
```

---

## API — Endpoints principaux

### Auth
| Méthode | Route                   | Description                       |
|---------|-------------------------|-----------------------------------|
| POST    | `/api/auth/login`       | Connexion                         |
| POST    | `/api/auth/first-login` | Choisir son premier mot de passe  |
| GET     | `/api/auth/me`          | Profil de l'utilisateur connecté  |

### Étudiant (token requis)
| Méthode | Route                       | Description                        |
|---------|-----------------------------|------------------------------------|
| GET     | `/api/courses`              | Liste des cours accessibles        |
| GET     | `/api/courses/:id`          | Détail cours + leçons + quiz       |
| GET     | `/api/lessons/:id`          | Contenu d'une leçon                |
| POST    | `/api/lessons/:id/complete` | Marquer une leçon complétée        |
| GET     | `/api/quizzes/:id`          | Données d'un quiz                  |
| POST    | `/api/quizzes/:id/submit`   | Soumettre les réponses             |
| GET     | `/api/quizzes/:id/result`   | Dernier résultat du quiz           |

### Admin (token admin requis)
| Méthode | Route                                   | Description                         |
|---------|-----------------------------------------|-------------------------------------|
| GET     | `/api/admin/users`                      | Liste des étudiants                 |
| POST    | `/api/admin/users/import`               | Importer des utilisateurs (CSV)     |
| PUT     | `/api/admin/users/:id/courses`          | Assigner des cours à un utilisateur |
| POST    | `/api/admin/courses`                    | Créer un cours                      |
| POST    | `/api/admin/courses/:id/lessons`        | Ajouter une leçon HTML              |
| PUT     | `/api/admin/lessons/:id`               | Modifier une leçon                  |
| POST    | `/api/admin/courses/:id/quizzes`        | Créer un quiz (JSON)                |
| POST    | `/api/admin/courses/:id/quizzes/import` | Importer un quiz (JSON ou CSV)      |
| GET     | `/api/admin/grades`                     | Notes de tous les étudiants         |

---

## Formats d'import

### Import utilisateurs CSV (`POST /api/admin/users/import`)

```
email,firstName,lastName
alice@example.fr,Alice,Dupont
bob@example.fr,Bob,Martin
```

### Import quiz CSV (`POST /api/admin/courses/:id/quizzes/import`)

```
question,option,correct
Combien de joueurs ?,4 joueurs,false
Combien de joueurs ?,5 joueurs,true
Combien de joueurs ?,6 joueurs,false
```

### Import quiz JSON

```json
{
  "title": "Quiz Basketball",
  "passingScore": 70,
  "questions": [
    {
      "text": "Combien de joueurs par équipe ?",
      "options": ["4", "5", "6"],
      "correctAnswers": ["5"]
    }
  ]
}
```

---

## Contraintes de sécurité respectées

- ✅ Mots de passe hachés avec **bcrypt** (cost factor ≥ 10)
- ✅ Authentification **JWT** avec expiration et vérification côté API
- ✅ Routes protégées — **401** non authentifié, **403** non autorisé
- ✅ Rôles **admin** et **étudiant** sur toutes les routes sensibles
- ✅ Validation des données avec **Zod**
- ✅ Variables d'environnement via `.env` non versionné
