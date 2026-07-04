# Soutenance — BasketLearn (CORELAB)

Document de préparation pour la défense orale (30 min, Q/R incluses). Reprend les 5 points attendus par le sujet + le suivi de projet (backlog/sprints/rétrospective).

---

## 0. Pitch (1 min)

**BasketLearn** est un LMS (Learning Management System) MERN sur le thème du basketball, développé pour Epitech (CORELAB) par une équipe de 3 :

- **Mayssae Bentayeb** — back-end (API, modèles, auth), front-end étudiant (auth, dashboard, redesign UI)
- **kyllianR** — modèles Mongoose, scoring des quiz, notifications, route de progression
- **Teddy Sibu** — configuration Docker, variables d'environnement, infrastructure

Les étudiants suivent des cours de basketball (règles, dribble, shoot, défense, tactiques), lisent des leçons HTML, passent des quiz QCM et suivent leur progression. Les administrateurs gèrent les utilisateurs, les cours, les leçons, les quiz et consultent les résultats.

---

## 1. Démonstration fonctionnelle

### Lancement

```bash
cd server && npm run seed   # une seule fois : 5 cours, 22 leçons, 6 quiz
cd server && npm run dev    # API sur :4242
cd client && npm run dev    # front sur :3000
```

### Comptes de démo

| Rôle | Email | Mot de passe |
|---|---|---|
| Étudiant | `etudiant@basketball.fr` | `basket123` |
| Admin | `admin@basketball.fr` | `admin123` |

### Parcours étudiant

1. **Login** → connexion avec le compte étudiant
2. **Dashboard** → stats globales (cours, leçons complétées, % de progression), bannière de notification si une nouvelle leçon vient de devenir disponible
3. **Liste des cours** → 5 cours basketball avec icône, description, barre de progression
4. **Détail d'un cours** → liste des leçons (faites / disponibles / verrouillées) + quiz du cours
5. **Leçon** → contenu HTML (texte, listes, tableaux, encarts), bouton "Marquer comme complétée"
6. **Quiz** → questions à choix multiples, barre de progression des réponses, soumission
7. **Résultat du quiz** → score %, réussi/échoué selon le seuil (`passingScore`), détail question par question

### Parcours admin

1. **Login admin** → redirection vers `/admin`
2. **Dashboard admin** → statistiques globales (nb étudiants, cours, leçons, quiz, résultats, taux de réussite)
3. **Gestion des utilisateurs** → import CSV d'une liste d'étudiants (mot de passe temporaire `ChangeMe123!`, hashé), assignation des cours accessibles par étudiant (cohortes)
4. **Gestion des cours** → création de cours, accès au détail
5. **Détail d'un cours (admin)** → création/édition/suppression de leçons (contenu HTML + date de disponibilité), création ou **import JSON** d'un quiz (questions, réponses, bonnes réponses, seuil de réussite)
6. **Notes des étudiants** → tableau des résultats de quiz par étudiant, filtrable

### Démo de la première connexion étudiant

1. Admin importe un nouvel étudiant via CSV → mot de passe temporaire généré
2. L'étudiant se connecte avec ce mot de passe → redirection automatique vers `/first-login`
3. L'étudiant choisit son propre mot de passe (`POST /api/auth/first-login`) → accès au dashboard

### Démo de la notification automatique (optionnel, si le temps le permet)

1. Une leçon a une `availableAt` au présent/passé et `notified: false`
2. Le scheduler (`node-cron`, toutes les 5 min) détecte la leçon, crée une notification et marque `notified: true`
3. L'étudiant voit la bannière orange sur son dashboard

---

## 2. Choix techniques majeurs et justification

| Choix | Justification |
|---|---|
| **MERN** (MongoDB, Express, React, Node) | Stack imposée par le sujet |
| **React + Vite + Bootstrap 5 + React Router v6** | Rapidité de mise en place, composants fonctionnels (hooks uniquement), responsive out-of-the-box, cohérent avec le wireframe Bootstrap initial |
| **JWT + bcrypt (cost 10, configurable via `BCRYPT_SALT_ROUNDS`)** | Exigence non négociable du sujet ; expiration du token configurable via `JWT_EXPIRES_IN` |
| **Zod** | Validation de toutes les entrées (login, import CSV/JSON, création de cours/leçons/quiz) avant traitement, retour 400 explicite |
| **Codes HTTP 401/403** | Middleware `authenticate` (token manquant/invalide → 401) et `authorize('admin')` (rôle insuffisant → 403) appliqués à toutes les routes sensibles |
| **Modèles Mongoose : User, Course, Lesson, Quiz, Progress, Notification** | Couvrent a minima Course/Lesson/Quiz demandés, + entités ajoutées selon besoin (progression, notifications) |
| **node-cron pour le scheduler de notifications** | Vérifie périodiquement les leçons devenues disponibles et déclenche la notification, sans dépendance externe lourde |
| **Notifications in-app (bannière)** plutôt qu'email | Pas de service SMTP à configurer/maintenir pour un projet pédagogique, retour instantané visible au prochain chargement du dashboard. Email envisagé comme amélioration future (cf. rétrospective) |
| **Mode "offline" / fallback mock côté client** | Permet au front-end de fonctionner avec des données fictives si l'API n'est pas démarrée → développement frontend/backend en parallèle sans blocage |
| **Tests Vitest + supertest + mongodb-memory-server** | Tests d'intégration des routes API critiques (auth, cours, leçons, quiz, progression, admin) sur une base MongoDB en mémoire, sans dépendance à un Mongo réel |
| **Docker / docker-compose** | Démarrage reproductible (`npm install && npm start` depuis un environnement vierge), facilite l'évaluation par l'équipe pédagogique |

---

## 3. Organisation de l'équipe

### Répartition

- **Mayssae** : back-end (API, modèles initiaux, auth JWT/bcrypt), pages étudiant (login, dashboard), redesign UI final (suppression emojis/éléments IA, charte orange/navy)
- **kyllianR** : modèles Mongoose, scoring des quiz, système de notifications, route de progression
- **Teddy Sibu** : configuration Docker (Dockerfiles, docker-compose), variables d'environnement (.env/.env.example)

### Méthodologie Git

- Une branche par fonctionnalité (`feature/...`), une Pull Request par branche, relecture par au moins un coéquipier avant fusion sur `dev`
- **Aucun push direct sur `main`** : `main` reçoit uniquement des PR validées (cf. PR #14 de réconciliation, dernière fusion)

### Historique des Pull Requests (15 PR fusionnées)

| PR | Branche | Contenu |
|---|---|---|
| #1 | `feature/docker-config` | Configuration Docker initiale |
| #4 | `feature/kyllian-quiz-scoring` | Logique de scoring des quiz |
| #5 | `feature/kyllian-notifications` | Modèle + routes de notifications |
| #6 | `feature/kyllian-models` | Modèles Mongoose (User, Course, Lesson, Quiz, Progress) |
| #7 | `feature/mayssae-auth-pages` | Pages Login / First-login + routes auth |
| #8 | `feature/mayssae-student-dashboard` | Dashboard étudiant |
| #9 | `feature/teddy-env-config` | Configuration des variables d'environnement |
| #10 | `feature/teddy-docker-improvements` | Améliorations Docker |
| #11 | `feature/kyllian-progress-route` | Route de progression |
| #12 | `feature/route-api` | Corrections et durcissement des routes API (contrôle d'accès aux cours) |
| #13 | `feature-scheduler` | Scheduler de notifications (node-cron) |
| #14 | `reconcile/merge-main-dev` | Réconciliation finale main/dev : redesign UI, correction du scheduler, fix leçons verrouillées + accès aux cours, tests |

---

## 4. Backlog complet (priorisé) et découpage en sprints

### Sprint 1 — Fondations

- [x] Mise en place de la stack MERN (client/server), configuration Docker (#1)
- [x] Wireframe Bootstrap (12 écrans) pour valider le parcours avant de coder
- [x] Modélisation Mongoose : User, Course, Lesson, Quiz, Progress (#6)
- [x] Authentification JWT + bcrypt, pages Login/First-login (#7)

### Sprint 2 — Contenu pédagogique & évaluation

- [x] Import/édition de leçons HTML par l'admin
- [x] Création et import JSON de quiz QCM avec seuil de réussite (`passingScore`) par l'admin
- [x] Logique de correction/scoring des quiz (#4)
- [x] Date de disponibilité des leçons (`availableAt`)

### Sprint 3 — Expérience étudiant & administration

- [x] Dashboard étudiant : progression, stats, accès rapide (#8)
- [x] Suivi de progression côté serveur (modèle Progress, route dédiée) (#11)
- [x] Import CSV d'utilisateurs + attribution des cours accessibles (cohortes)
- [x] Consultation des notes par l'administrateur (AdminGradesPage)
- [x] Configuration des variables d'environnement (#9), améliorations Docker (#10)

### Sprint 4 — Notifications, sécurisation et qualité

- [x] Système de notifications en base + UI (bannière) (#5)
- [x] Scheduler automatique (node-cron) de notification à disponibilité des leçons (#13, corrigé en #14)
- [x] Durcissement du contrôle d'accès aux cours (`accessibleCourses`, 403 si non autorisé) (#12)
- [x] Suite de tests Vitest (22 tests, 6 fichiers) sur les routes critiques
- [x] Réconciliation finale main/dev, redesign UI sobre (#14)

**Estimation globale :** ~4 sprints, toutes les user stories du cahier des charges (Administration, Création/diffusion de contenu, Expérience d'apprentissage) sont **réalisées**.

---

## 5. Fonctionnalités ajoutées au backlog initial (et justification)

Ces fonctionnalités ne figurent pas dans les user stories d'origine mais ont été ajoutées :

| Fonctionnalité | Justification |
|---|---|
| **Mode offline / données mock côté client** (`api.js`, `auth.js`) | Continuité du développement frontend même quand l'API ou MongoDB n'est pas disponible (cf. rétrospective : "port MongoDB non standard") |
| **Page 404 personnalisée** (`NotFoundPage.jsx`) | Meilleure expérience utilisateur sur les routes inexistantes, attendu d'une SPA avec React Router |
| **Footer** (`Footer.jsx`) | Cohérence visuelle/professionnelle de l'interface |
| **Dashboard admin avec statistiques globales** (`/api/stats`, `AdminDashboard.jsx`) | Au-delà de "consulter les notes", une vue d'ensemble (nb étudiants, cours, leçons, quiz, taux de réussite) aide l'admin à piloter la plateforme |
| **Conteneurisation Docker complète** (docker-compose, Dockerfiles client/serveur) | Facilite le démarrage depuis un environnement vierge pour l'équipe pédagogique |
| **Suite de tests automatisés (Vitest + mongodb-memory-server)** | Demandé par les standards de qualité ; ajouté pour fiabiliser les routes critiques (auth, cours, leçons, quiz, progression, admin) |

---

## 6. Wireframe initial vs version finale — analyse des écarts

Le wireframe (`wireframe/`, 12 pages HTML statiques, style gris/noir Bootstrap) a servi de base à tout le développement.

| Wireframe | Page finale | Écarts principaux |
|---|---|---|
| `01-login.html` | `LoginPage.jsx` | Charte graphique finale orange/navy (vs gris/noir du wireframe) ; suppression du bloc "comptes de démonstration" affiché sur la page (présent dans une version intermédiaire, retiré en finalisation) |
| `02-first-login.html` | `FirstLoginPage.jsx` | Fidèle au wireframe ; ajout de la validation Zod côté serveur |
| `03-dashboard-etudiant.html` | `StudentDashboard.jsx` | Ajout de la **bannière de notification** (non présente dans le wireframe initial) |
| `04-liste-cours.html` | `CoursesPage.jsx` | Fidèle ; cartes de cours avec icône/couleur par thème basketball |
| `05-detail-cours.html` | `CoursePage.jsx` | Le wireframe prévoyait l'affichage des leçons à venir avec leur date ("verrouillées") dans la liste ; **dans la version finale, l'API masque entièrement les leçons non encore disponibles** pour les non-admins (`courses.js`, `availableLessonFilter`) — écart volontaire pour la sécurité/confidentialité du contenu, à justifier en défense (cf. section 9) |
| `06-lecon.html` | `LessonPage.jsx` | L'écran "leçon verrouillée" (cadenas + date de disponibilité) est **implémenté côté client** (`LessonItem.jsx`, `LessonPage.jsx`) mais peu atteignable avec les données réelles pour la raison ci-dessus — visible surtout avec les données mock |
| `07-quiz.html` | `QuizPage.jsx` | Fidèle ; ajout d'une barre de progression des réponses et désactivation du bouton "Soumettre" tant que toutes les questions ne sont pas répondues |
| `08-resultat-quiz.html` | `QuizResultPage.jsx` | Fidèle ; détail question par question avec bonnes réponses, comparaison au seuil `passingScore` |
| `09-admin-dashboard.html` | `AdminDashboard.jsx` | Ajout des statistiques globales (`/api/stats`), non détaillées dans le wireframe |
| `10-admin-etudiants.html` | `AdminUsersPage.jsx` | Fidèle ; import CSV + modale d'assignation des cours par cases à cocher |
| `11-admin-cours.html` | `AdminCoursesPage.jsx` + `AdminCourseDetailPage.jsx` | Le wireframe regroupait gestion des cours et du contenu sur un seul écran ; **scindé en deux pages** (liste des cours / détail d'un cours avec gestion leçons+quiz) pour la clarté |
| `12-admin-notes.html` | `AdminGradesPage.jsx` | Fidèle ; ajout d'un champ de recherche/filtre par étudiant |

**Synthèse pour la défense :** l'architecture générale et le parcours utilisateur suivent fidèlement le wireframe. Les écarts viennent (1) du redesign graphique final (palette orange/navy au lieu du gris/noir de maquette), (2) de fonctionnalités ajoutées (stats admin, bannière de notification), et (3) d'un choix de sécurité/confidentialité côté API qui masque les leçons à venir — point à présenter comme un arbitrage assumé, avec la piste d'évolution (afficher les leçons à venir avec leur date sans révéler leur contenu).

---

## 7. Rétrospective

Voir `retrospective.md` pour le compte-rendu complet (1 page). Points clés à mentionner en défense :

**Ce qui a bien fonctionné**
- Communication d'équipe, répartition claire des périmètres (back / front étudiant / front admin)
- Wireframe réalisé en amont → moins de débats pendant le dev
- Mode offline/mock → développement parallèle sans blocage

**Difficultés rencontrées**
- Désynchronisation front/back sur `isFirstLogin` (champ retourné par l'API mais pas propagé jusqu'au composant)
- Gestion des dates de disponibilité des leçons (cohérence client/serveur)
- Port MongoDB non standard (27042) sur la machine de dev → temps de debug

**Ce qu'on ferait différemment**
- Écrire les tests dès la création de chaque route, pas à la fin
- Concevoir le modèle `Progress` dès le départ (éviter le double système localStorage/DB)
- `.env` côté client également (URL API actuellement codée dans `vite.config.js`)

**Pistes d'amélioration si plus de temps**
- Notifications par email (en complément de l'in-app)
- Tableau de bord de statistiques admin plus détaillé

---

## 8. Conformité aux contraintes non négociables (checklist sécurité)

| Exigence | Statut | Détail |
|---|---|---|
| bcrypt cost ≥ 10 | ✅ | `BCRYPT_SALT_ROUNDS` (défaut 10) dans `auth.js`/`admin.js` |
| JWT avec expiration | ✅ | `JWT_EXPIRES_IN` (défaut `1d`), vérifié par le middleware `authenticate` |
| 401 non-authentifié / 403 non-autorisé | ✅ | Middleware `authenticate` (401) et `authorize('admin')` (403) sur toutes les routes sensibles |
| Rôles admin/étudiant appliqués | ✅ | `req.user.role`, routes `/api/admin/*` protégées par `authorize('admin')` |
| Validation Zod des entrées | ✅ | `middleware/validate.js`, schémas pour login, import CSV/JSON, cours/leçons/quiz |
| `.env` non versionné + `.env.example` | ✅ | `server/.env` (gitignore), `server/.env.example` fourni |
| Tests automatisés (Vitest) | ✅ | 22 tests / 6 fichiers (auth, courses, lessons, quizzes, progress, admin) |
| Branches + PR + revue, pas de push direct sur `main` | ✅ | 15 PR fusionnées, dernière réconciliation via PR #14 |
| README.md (install, env, démarrage) | ✅ | `README.md` à la racine |
| client/ port 3000, server/ port 4242 | ✅ | Conforme |

---

## 9. Points à préparer / questions probables

- **Pourquoi les leçons à venir sont-elles masquées dans `/api/courses/:id` plutôt qu'affichées "verrouillées" comme dans le wireframe ?**
  Réponse suggérée : par défaut on a privilégié la confidentialité (un étudiant ne voit que ce à quoi il a accès) ; l'UI "verrouillée avec date" existe côté client et pourrait être réactivée en renvoyant les leçons à venir avec un contenu masqué (`content: null`) si le jury préfère ce comportement — c'est un arbitrage produit à assumer/discuter.

- **Pourquoi notifications in-app et pas email ?**
  Simplicité (pas de SMTP), suffisant pour la démonstration, email identifié comme évolution future.

- **Comment est gérée la confidentialité des résultats entre étudiants ?**
  `accessibleCourses` par utilisateur + `req.user.userId` pour filtrer la progression/les résultats ; un étudiant ne peut interroger que ses propres résultats.

- **Démonstration du scheduler** : peut nécessiter d'attendre jusqu'à 5 min (cron `*/5 * * * *`) ou de seed une leçon avec `availableAt` au passé et `notified: false` pour le déclencher immédiatement au démarrage du serveur.
