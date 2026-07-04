# Explication du projet BasketLearn

## C'est quoi ce projet ?

C'est une plateforme e-learning sur le basketball.
Les étudiants peuvent suivre des cours, lire des leçons, passer des quiz et voir leur progression.
Les admins peuvent gérer les étudiants, les cours, les leçons et voir les notes.

Stack utilisée : **MongoDB + Express + React + Node.js (MERN)**

---

## Structure générale

```
projet/
├── client/       → le site web (React, ce que l'utilisateur voit)
├── server/       → l'API (Express, la logique métier et la base de données)
├── wireframe/    → la maquette Bootstrap (pages HTML statiques)
└── README.md     → instructions pour lancer le projet
```

---

## CLIENT (ce que l'utilisateur voit)

### Point d'entrée

**`client/src/main.jsx`**
C'est le premier fichier qui se lance. Il démarre React, importe Bootstrap (le CSS du design) et affiche l'application.

**`client/src/App.jsx`**
C'est le chef d'orchestre du site. Il définit toutes les routes (les URLs) :
- `/login` → page de connexion
- `/dashboard` → tableau de bord étudiant
- `/courses` → liste des cours
- `/courses/:id` → détail d'un cours
- `/lessons/:id` → affichage d'une leçon
- `/quiz/:id` → passer un quiz
- `/admin` → espace admin
- etc.

Il protège aussi les routes : si tu n'es pas connecté, tu es redirigé vers `/login`. Si tu n'es pas admin, tu ne peux pas accéder à `/admin`.

---

### Pages étudiants (`client/src/pages/`)

**`LoginPage.jsx`**
La page de connexion. Elle envoie l'email et le mot de passe à l'API. Si c'est la première connexion de l'étudiant, elle redirige vers `/first-login`. Si c'est un admin, il va vers `/admin`. Sinon, vers `/dashboard`.

**`FirstLoginPage.jsx`**
Quand un admin crée un étudiant via CSV, le mot de passe est temporaire. Cette page permet à l'étudiant de choisir son propre mot de passe dès la première connexion. Elle appelle `POST /api/auth/first-login`.

**`StudentDashboard.jsx`**
C'est la page principale de l'étudiant. Elle affiche :
- Un message de bienvenue avec son prénom
- Des statistiques (nombre de cours, leçons complétées, % de progression)
- Une barre de progression générale
- Les cours en cours
- Un accès rapide aux quiz
- Les notifications de nouvelles leçons disponibles

**`CoursesPage.jsx`**
La liste de tous les cours disponibles. Chaque cours est affiché avec une carte (titre, description, icône, progression).

**`CoursePage.jsx`**
Le détail d'un cours. On y voit la liste des leçons (certaines verrouillées si la date n'est pas encore arrivée) et les quiz disponibles. Si l'étudiant a déjà passé un quiz, son score apparaît.

**`LessonPage.jsx`**
Affiche le contenu HTML d'une leçon. Si la leçon est verrouillée (date future), elle affiche un cadenas et explique quand la leçon sera disponible. Si la leçon est disponible, l'étudiant peut la lire et la marquer comme complétée.

**`QuizPage.jsx`**
Le quiz. Affiche les questions une par une avec des boutons radio. Une barre de progression montre combien de questions ont été répondues. Le bouton "Soumettre" n'est actif que quand toutes les questions sont répondues. Les réponses sont envoyées à l'API.

**`QuizResultPage.jsx`**
Affiche les résultats après un quiz : le score en %, si c'est réussi ou échoué, le nombre de bonnes/mauvaises réponses, et le détail question par question avec les bonnes réponses.

---

### Pages admin (`client/src/pages/admin/`)

**`AdminDashboard.jsx`**
Page d'accueil de l'admin. Affiche des statistiques globales (nombre d'étudiants, cours, résultats de quiz) et des raccourcis vers les autres pages.

**`AdminUsersPage.jsx`**
Gestion des étudiants. Deux fonctions :
1. Importer une liste d'étudiants via un fichier CSV (format : email, prénom, nom)
2. Assigner des cours à un étudiant spécifique via une fenêtre modale avec des cases à cocher

**`AdminCoursesPage.jsx`**
Liste de tous les cours avec un formulaire pour en créer de nouveaux. Chaque cours a un bouton "Gérer le contenu" qui mène à la page de détail.

**`AdminCourseDetailPage.jsx`**
C'est la page la plus complète côté admin. Elle permet :
- Créer une leçon (titre, contenu HTML, ordre, date de disponibilité)
- Modifier une leçon existante
- Supprimer une leçon
- Créer un quiz en remplissant un formulaire
- Importer un quiz depuis un fichier JSON
- Supprimer un quiz

**`AdminGradesPage.jsx`**
Consulter les notes de tous les étudiants. Affiche un tableau avec le nom de l'étudiant, le quiz passé, le score, si c'est réussi ou échoué, et la date. Il y a un champ de recherche pour filtrer par étudiant.

---

### Composants réutilisables (`client/src/components/`)

**`Navbar.jsx`**
La barre de navigation en haut du site. Elle change selon le rôle : les étudiants voient "Tableau de bord" et "Cours", les admins voient "Étudiants", "Cours" et "Notes". Elle affiche le prénom de l'utilisateur connecté et un bouton de déconnexion.

**`CourseCard.jsx`**
La carte d'un cours (utilisée sur le dashboard et la page des cours). Affiche l'icône, le titre, la description, le nombre de leçons, et une barre de progression. Le bouton "Accéder" redirige vers le cours.

**`ProgressBar.jsx`**
Une barre de progression réutilisable. Prend une valeur, un total, une couleur et une hauteur. Affiche le pourcentage et les chiffres.

**`LessonItem.jsx`**
Un élément de la liste des leçons. Affiche la leçon avec 3 états possibles :
- Complétée (fond vert, coche blanche)
- Disponible non faite (bleu, numéro)
- Verrouillée (gris, cadenas, date de disponibilité)

**`QuizQuestion.jsx`**
Une question de quiz avec ses options de réponse. Quand une option est sélectionnée, elle est mise en évidence en orange.

**`ScoreDisplay.jsx`**
Affiche le résultat d'un quiz : le score en grand, le trophée ou l'emoji musclé selon le résultat, les statistiques (bonnes/mauvaises/total) et le seuil de réussite.

**`NotificationBanner.jsx`**
Affiche une bannière orange en haut du dashboard quand une nouvelle leçon est disponible depuis moins de 7 jours. L'étudiant peut cliquer pour aller à la leçon ou fermer la notification. Les notifications fermées sont mémorisées dans le navigateur.

**`PrivateRoute.jsx`**
Protège les routes étudiants. Si l'utilisateur n'est pas connecté, il est redirigé vers `/login`.

**`AdminRoute.jsx`**
Protège les routes admin. Si l'utilisateur n'est pas connecté ou n'est pas admin, il est redirigé.

---

### Services (`client/src/services/`)

**`auth.js`**
Gère la connexion. Essaie d'abord d'appeler la vraie API (`POST /api/auth/login`). Si le serveur ne répond pas (hors ligne), utilise des données fictives pour que l'application fonctionne quand même en développement. Stocke le token JWT dans le navigateur.

**`api.js`**
Toutes les fonctions qui appellent l'API (récupérer les cours, les leçons, les quiz, envoyer les réponses, marquer une leçon complétée). Si l'API ne répond pas, utilise des données fictives avec de vrais cours de basketball. Sauvegarde la progression dans le navigateur comme cache.

**`adminApi.js`**
Les fonctions API réservées aux admins (importer des utilisateurs, créer des cours, modifier des leçons, importer des quiz, voir les notes).

---

### Hooks et utilitaires

**`hooks/useAuth.jsx`**
Un "contexte" React qui partage l'état de connexion dans toute l'application. N'importe quel composant peut appeler `useAuth()` pour savoir si l'utilisateur est connecté, qui il est, et se déconnecter.

**`utils/date.js`**
Deux petites fonctions : formater une date en français (ex: "15 juin 2026") et vérifier si une date est dans le futur.

---

## SERVER (la logique et la base de données)

### Point d'entrée

**`server/src/index.js`**
Démarre le serveur Express sur le port 4242. Se connecte à MongoDB. Enregistre toutes les routes. Gère les erreurs.

---

### Modèles MongoDB (`server/src/models/`)

Ce sont les structures des données stockées dans la base.

**`User.js`**
Un utilisateur : email, mot de passe hashé, prénom, nom, rôle (étudiant ou admin), si c'est le premier login, et la liste des cours auxquels il a accès.

**`Course.js`**
Un cours : titre, description, icône emoji, couleur.

**`Lesson.js`**
Une leçon : à quel cours elle appartient, titre, contenu HTML, numéro d'ordre, date de disponibilité.

**`Quiz.js`**
Un quiz : à quel cours il appartient, titre, seuil de réussite (en %), et la liste des questions. Chaque question a un énoncé, des options de réponse, et les bonnes réponses.

**`Progress.js`**
La progression d'un utilisateur : à qui c'est, quel type (leçon ou quiz), quelle leçon ou quel quiz, la date, et pour les quiz : le score et si c'est réussi.

---

### Middleware (`server/src/middleware/`)

**`auth.js`**
Vérifie le token JWT dans chaque requête protégée. Si le token manque → erreur 401. Si le token est invalide ou expiré → erreur 401. Si l'utilisateur n'a pas le bon rôle → erreur 403.

**`validate.js`**
Valide le contenu des requêtes avec Zod (une bibliothèque de validation). Si les données envoyées sont incorrectes (email invalide, champ manquant, etc.) → erreur 400 avec l'explication.

---

### Routes API (`server/src/routes/`)

**`auth.js`**
- `POST /api/auth/login` : connexion, vérifie email + mot de passe, retourne un token JWT
- `POST /api/auth/first-login` : l'étudiant choisit son mot de passe pour la première fois
- `GET /api/auth/me` : retourne les infos de l'utilisateur connecté

**`courses.js`**
- `GET /api/courses` : retourne la liste des cours avec la progression de l'étudiant connecté
- `GET /api/courses/:id` : retourne un cours complet avec ses leçons et quiz, et quelles leçons l'étudiant a déjà complétées

**`lessons.js`**
- `GET /api/lessons/:id` : retourne une leçon
- `POST /api/lessons/:id/complete` : marque une leçon comme complétée (refuse si la date n'est pas encore arrivée)

**`quizzes.js`**
- `GET /api/quizzes/:id` : retourne un quiz avec ses questions
- `POST /api/quizzes/:id/submit` : corrige les réponses, calcule le score, sauvegarde le résultat
- `GET /api/quizzes/:id/result` : retourne le dernier résultat de l'utilisateur pour ce quiz

**`admin.js`**
Toutes les routes commencent par `/api/admin/` et nécessitent d'être admin.
- Importer des utilisateurs depuis un CSV
- Assigner des cours à un utilisateur
- Créer/modifier/supprimer des cours
- Créer/modifier/supprimer des leçons
- Créer/importer des quiz (JSON ou CSV)
- Consulter les notes de tous les étudiants

---

### Scripts

**`server/src/seed.js`**
Peuple la base de données avec de vraies données basketball :
5 cours, 22 leçons avec du vrai contenu HTML, 6 quiz avec de vraies questions, 2 comptes utilisateurs (admin + étudiant). À lancer une seule fois avec `npm run seed`.

---

### Tests (`server/src/tests/`)

**`setup.js`**
Crée une base de données temporaire en mémoire pour les tests. Crée des utilisateurs, cours, leçons et quiz de test.

**`auth.test.js`**
5 tests sur la connexion : connexion réussie, mauvais mot de passe, email inconnu, email invalide, accès refusé sans token.

**`quizzes.test.js`**
3 tests sur les quiz : score 100% quand toutes les réponses sont bonnes, score 0% quand tout est faux, refus sans token.

**`lessons.test.js`**
3 tests sur les leçons : marquer complétée réussit, refus si la date est future, refus sans token.

---

## WIREFRAME (la maquette)

12 pages HTML statiques qui montrent le design prévu avant de coder le vrai site. En style gris/noir (wireframe). Utilisées à la soutenance pour montrer ce qui était prévu et comparer avec le résultat final.

- `index.html` : page d'accueil avec navigation vers toutes les pages
- `01-login.html` : connexion
- `02-first-login.html` : premier login étudiant
- `03-dashboard-etudiant.html` : tableau de bord avec stats et progression
- `04-liste-cours.html` : catalogue des 5 cours basketball
- `05-detail-cours.html` : cours avec leçons vertes/verrouillées et quiz
- `06-lecon.html` : leçon HTML + version verrouillée avec cadenas
- `07-quiz.html` : quiz MCQ en cours de réponse
- `08-resultat-quiz.html` : résultats avec score et feedback
- `09-admin-dashboard.html` : tableau de bord admin
- `10-admin-etudiants.html` : import CSV et assignation de cours
- `11-admin-cours.html` : gestion des leçons et quiz
- `12-admin-notes.html` : tableau des notes étudiants

---

## Comment lancer le projet

```bash
# 1. Remplir la base de données (une seule fois)
cd server && npm run seed

# 2. Démarrer le serveur (terminal 1)
cd server && npm run dev

# 3. Démarrer le site (terminal 2)
cd client && npm run dev
```

Ouvrir http://localhost:3000

**Comptes :**
- Étudiant : `etudiant@basketball.fr` / `basket123`
- Admin : `admin@basketball.fr` / `admin123`

---

## Comment c'est fait techniquement

Le site fonctionne comme ça :

1. L'étudiant se connecte → le serveur vérifie email + mot de passe → retourne un token JWT
2. Ce token est sauvegardé dans le navigateur
3. À chaque action (voir les cours, passer un quiz...), le navigateur envoie ce token au serveur
4. Le serveur vérifie le token, récupère les données dans MongoDB et les renvoie
5. React affiche les données à l'écran

Si le serveur est hors ligne, le site fonctionne quand même avec des données fictives (mode offline).

Les mots de passe ne sont jamais stockés en clair : ils sont transformés par bcrypt (algorithme de hachage) avant d'être sauvegardés.
