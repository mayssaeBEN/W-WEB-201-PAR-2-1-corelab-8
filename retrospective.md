# Compte rendu de rétrospective — BasketLearn

**Projet :** CORELAB — Plateforme LMS e-learning basketball
**Équipe :** 3 personnes
**Date :** Juin 2026

---

## Ce qui s'est bien passé

**La communication dans l'équipe a été notre point fort.** Nous avons rapidement décidé ensemble du thème (basketball), de l'organisation des branches Git et de la répartition des tâches. Chacun avait un périmètre clair : back-end (API, modèles, authentification), front-end étudiant (dashboard, leçons, quiz), front-end admin (gestion des cours, des utilisateurs, des notes).

**La maquette wireframe nous a vraiment aidés.** En la faisant au départ, on savait exactement quelles pages construire et à quoi elles devaient ressembler. Ça a évité beaucoup de discussions inutiles en cours de développement.

**Le mode offline (fallback mock)** a été une bonne décision. Pendant la phase où le serveur n'était pas encore prêt, le front-end fonctionnait quand même avec des données fictives. On a pu avancer en parallèle sans se bloquer.

---

## Ce qui a été difficile

**La synchronisation entre front-end et back-end** a parfois créé des bugs. Par exemple, le champ `isFirstLogin` était bien retourné par l'API mais pas transmis jusqu'au composant React — la redirection vers la page de premier login ne se déclenchait pas. On a appris à mieux tester les flux complets plutôt que chaque partie séparément.

**La gestion des dates de disponibilité des leçons** a été plus complexe que prévu. Il fallait que le client et le serveur soient cohérents sur le calcul de la disponibilité, et que le composant `LessonItem` utilise bien l'information venant du serveur et pas seulement le cache local.

**Le port MongoDB** sur notre machine était 27042 au lieu du port standard 27017. Ça a pris du temps à diagnostiquer. On a appris à toujours vérifier les logs du service avant de chercher dans le code.

---

## Ce qu'on ferait différemment

**On aurait commencé les tests plus tôt.** On a écrit les tests à la fin, ce qui a permis de trouver des bugs au dernier moment. Si on recommençait, on écrirait au moins les tests des routes critiques (login, quiz submit) dès que la route est créée.

**On aurait mieux géré la progression côté serveur dès le début.** Au départ on utilisait localStorage pour tout, et on a dû faire une migration partielle vers la base de données. Concevoir le modèle `Progress` en premier aurait évité ce double système.

**On aurait utilisé des variables d'environnement pour le front-end aussi.** L'URL de l'API est codée en dur dans `vite.config.js`. Pour un vrai projet, on utiliserait un fichier `.env` côté client également.

---

## Ce qu'on a appris

- Travailler en équipe sur une base de code partagée avec des branches et des Pull Requests
- Structurer une API REST complète avec Express, Mongoose et JWT
- Sécuriser une application : hachage bcrypt, validation Zod, codes HTTP corrects
- Écrire des tests automatisés avec Vitest et une base de données en mémoire
- L'importance d'une maquette avant de coder : ça fait gagner du temps

---

## Conclusion

Le projet est fonctionnel et couvre toutes les user stories du cahier des charges. Le thème basketball a rendu le travail plus concret et motivant — les cours, les leçons et les quiz ont du vrai contenu pédagogique. Si on avait plus de temps, on ajouterait un système de notifications par email et un tableau de bord de statistiques plus détaillé pour les admins.
