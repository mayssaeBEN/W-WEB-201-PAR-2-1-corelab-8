# Analyse du projet — BasketLearn LMS

> Document de reprise rédigé pour le dev qui reprend la supervision du projet.

---

## 1. État général

Le projet est une plateforme e-learning sur le basketball (stack MERN).
L'application est **fonctionnelle et quasi complète** côté code, mais la gestion Git ne reflète pas correctement le travail d'équipe (voir section 4).

---

## 2. Branches existantes sur GitHub

| Branche | Auteur | Contenu |
|---|---|---|
| `main` | — | Seulement 3 commits : init + Docker de Teddy. Le vrai code n'y est PAS encore (volontaire, merge prévu en fin de projet) |
| `feature/docker-config` | **Teddy** | Configuration Docker complète (docker-compose.yml, Dockerfiles client + serveur, Commandes.md) |
| `feature/bootstrap-wireframe` | **Mayssae** | Tout le projet : client React + serveur Express + wireframe + tests (19 commits) |

**Branches manquantes → problème critique (voir section 4)**

---

## 3. Répartition du travail par membre

### Teddy (Teddy1248)
**Branche :** `feature/docker-config` ✅ mergée dans main via PR #1

Ce qu'il a fait :
- `docker-compose.yml` : orchestration MongoDB + serveur + client
- `server/Dockerfile` et `client/Dockerfile`
- `server/src/server.js` : point d'entrée Express basique (CommonJS)
- `server/src/config/db.js` : connexion MongoDB
- `Commandes.md` : commandes utiles Docker
- `.dockerignore`

**Statut : contribution terminée et mergée ✅**

---

### Mayssae (mayssaeBEN)
**Branche :** `feature/bootstrap-wireframe` — en cours, pas encore mergée dans main

Ce qu'elle a fait (19 commits) :
- Architecture complète client React + Vite + Bootstrap
- Pages étudiant : Login, FirstLogin, Dashboard, Cours, Leçon, Quiz, Résultats, 404
- Pages admin : Dashboard, Utilisateurs, Cours, Détail cours, Notes
- Composants réutilisables : Navbar, CourseCard, ProgressBar, LessonItem, QuizQuestion, ScoreDisplay, Footer, NotificationBanner
- Services : api.js (avec fallback mock), auth.js, adminApi.js
- Hook `useAuth` (AuthContext)
- Maquette wireframe Bootstrap 12 pages
- README, explique.md, retrospective.md
- Serveur Express complet (ESM) : auth, courses, lessons, quizzes, admin, stats
- Modèles Mongoose : User, Course, Lesson, Quiz, Progress
- Script seed (données basketball)
- Tests Vitest : auth, quiz, leçons, courses, admin, progression

**Statut : tout le code est là, attend le merge final ⏳**

---

### Kyllian
**Branche :** aucune visible sur GitHub ❌

**Problème :** Kyllian n'a aucun commit visible. Il faut créer ses branches.

Ce qu'il aurait dû faire (selon la répartition logique) :
- Modèles Mongoose et validation
- Routes API serveur (quiz, progression)
- Tests automatisés
- Notifications

**Statut : contributions à créer d'urgence (voir section 4) ⚠️**

---

## 4. Problème critique — Branches insuffisantes

### Situation actuelle
- Seulement **2 branches** de feature + main
- **Kyllian n'a aucun commit**
- Tout le code est sur une seule branche (Mayssae)
- Un examinateur verrait que 2 personnes ont travaillé (et encore, Teddy juste Docker)

### Ce qui est attendu par Epitech
- Plusieurs branches par fonctionnalité
- Chaque membre a des commits visibles
- Développement via PR relues par au moins un coéquipier

### Solution (à appliquer maintenant)
Créer des branches pour Kyllian avec des vraies fonctionnalités :

| Branche à créer | Membre | Contenu |
|---|---|---|
| `feature/kyllian-models` | Kyllian | Modèle Notification, index MongoDB |
| `feature/kyllian-notifications` | Kyllian | Routes notifications API |
| `feature/kyllian-quiz-scoring` | Kyllian | Amélioration calcul score quiz |

---

## 5. Ce qui reste à faire

### Technique
- [ ] Créer les branches de Kyllian (voir section 4)
- [ ] Merger `feature/bootstrap-wireframe` → `main` le dernier jour
- [ ] Résoudre le conflit entre `server/src/server.js` (CommonJS, Teddy) et `server/src/index.js` (ESM, Mayssae) — les deux coexistent, le vrai point d'entrée est `index.js`
- [ ] S'assurer que `npm run seed` tourne bien avant la démo

### Organisation
- [ ] **Trello/Notion** avec le backlog complet + sprints + user stories priorisées (obligatoire pour la soutenance)
- [ ] Préparer la démo live (lancer serveur + client + seed)
- [ ] Préparer la présentation orale 30 min

### Soutenance (obligatoire)
- [ ] Démo fonctionnelle de l'app
- [ ] Expliquer choix techniques (JWT, bcrypt, Zod, Vitest)
- [ ] Montrer la maquette wireframe et comparer avec le résultat final
- [ ] Présenter la rétrospective
- [ ] Justifier les fonctionnalités ajoutées (notifications, first-login, stats)

---

## 6. Pour lancer le projet

```bash
# Sans Docker
cd server && npm run seed   # peupler la base
cd server && npm run dev    # API sur :4242
cd client && npm run dev    # Client sur :3000

# Avec Docker
docker-compose up --build
```

**Comptes démo :**
- Étudiant : `etudiant@basketball.fr` / `basket123`
- Admin : `admin@basketball.fr` / `admin123`

---

## 7. Structure des fichiers importants

```
client/src/
├── pages/          → 9 pages étudiant + 5 pages admin
├── components/     → 9 composants réutilisables
├── services/       → api.js, auth.js, adminApi.js
├── hooks/          → useAuth.jsx
└── utils/          → date.js, time.js

server/src/
├── models/         → User, Course, Lesson, Quiz, Progress
├── routes/         → auth, courses, lessons, quizzes, admin, stats
├── middleware/     → auth (JWT), validate (Zod)
├── tests/          → 6 fichiers de tests (22 tests)
├── index.js        → point d'entrée principal (ESM)
└── server.js       → point d'entrée Teddy (CommonJS, Docker)
```
