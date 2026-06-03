# Commandes d'installation — Corelab LMS

Ce fichier regroupe les commandes utiles pour installer et lancer le projet **Corelab LMS** sur **macOS** et **Windows**.

Le projet utilise la stack **MERN** :

- MongoDB
- Express.js
- React.js
- Node.js

Ports demandés pour le projet :

- API Express : `4242`
- Client React : `3000`

---

# 1. Installation sur macOS

## 1.1 Installer les outils développeur Apple

```bash
xcode-select --install
```

## 1.2 Installer Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Vérifier l'installation :

```bash
brew --version
```

## 1.3 Installer Git et Node.js

```bash
brew update
brew install git node
```

Vérifier :

```bash
git --version
node -v
npm -v
```

## 1.4 Installer MongoDB Community

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

Démarrer MongoDB :

```bash
brew services start mongodb-community@8.0
```

Vérifier MongoDB :

```bash
brew services list
mongosh --eval 'db.runCommand({ ping: 1 })'
```

Arrêter MongoDB si besoin :

```bash
brew services stop mongodb-community@8.0
```

---

# 2. Installation sur Windows

> À faire dans **PowerShell en administrateur**.

## 2.1 Vérifier que WinGet est disponible

```powershell
winget --version
```

Si la commande ne fonctionne pas, installe ou mets à jour **App Installer** depuis le Microsoft Store.

## 2.2 Installer Git

```powershell
winget install --id Git.Git -e --source winget
```

Ferme et rouvre PowerShell, puis vérifie :

```powershell
git --version
```

## 2.3 Installer Node.js LTS

```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget
```

Ferme et rouvre PowerShell, puis vérifie :

```powershell
node -v
npm -v
```

## 2.4 Installer MongoDB Community Server

```powershell
winget install --id MongoDB.Server -e --source winget
```

## 2.5 Installer MongoDB Shell

```powershell
winget install --id MongoDB.Shell -e --source winget
```

## 2.6 Installer MongoDB Compass, optionnel

MongoDB Compass est une interface graphique pour voir les bases de données MongoDB.

```powershell
winget install --id MongoDB.Compass.Community -e --source winget
```

## 2.7 Vérifier MongoDB sous Windows

Vérifier si le service MongoDB existe :

```powershell
Get-Service MongoDB
```

Démarrer MongoDB :

```powershell
Start-Service MongoDB
```

Vérifier l'état du service :

```powershell
Get-Service MongoDB
```

Tester la connexion :

```powershell
mongosh "mongodb://127.0.0.1:27017"
```

Dans `mongosh`, tu peux tester :

```javascript
db.runCommand({ ping: 1 })
```

Pour quitter :

```javascript
exit
```

## 2.8 Si MongoDB ne démarre pas avec le service

Créer le dossier de données :

```powershell
New-Item -ItemType Directory -Force -Path C:\data\db
```

Lancer MongoDB manuellement :

```powershell
mongod --dbpath C:\data\db
```

Garde ce terminal ouvert pendant que tu travailles.

---

# 3. Récupérer le projet GitHub

## 3.1 macOS

```bash
cd ~/Documents/EPITECH
git clone git@github.com:EpitechWebAcademiePromo2027/W-WEB-201-PAR-2-1-corelab-8.git
cd W-WEB-201-PAR-2-1-corelab-8
```

## 3.2 Windows PowerShell

Exemple depuis le dossier `Documents` :

```powershell
cd $HOME\Documents
New-Item -ItemType Directory -Force -Path EPITECH
cd EPITECH
git clone git@github.com:EpitechWebAcademiePromo2027/W-WEB-201-PAR-2-1-corelab-8.git
cd W-WEB-201-PAR-2-1-corelab-8
```

Si vous utilisez une URL HTTPS au lieu du SSH :

```powershell
git clone https://github.com/EpitechWebAcademiePromo2027/W-WEB-201-PAR-2-1-corelab-8.git
cd W-WEB-201-PAR-2-1-corelab-8
```

## 3.3 Vérifier la branche

```bash
git branch
git status
```

Passer sur `develop` :

```bash
git checkout develop
```

Si `develop` n'existe pas encore localement mais existe sur GitHub :

```bash
git fetch origin
git checkout develop
```

---

# 4. Créer la structure du projet

Structure attendue :

```txt
W-WEB-201-PAR-2-1-corelab-8/
├── client/
├── server/
├── README.md
├── .gitignore
└── Commandes.md
```

---

# 5. Installation du serveur Express

## 5.1 Créer le dossier serveur

### macOS

```bash
mkdir server
cd server
npm init -y
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force -Path server
cd server
npm init -y
```

## 5.2 Installer les dépendances backend

Commande identique sur macOS et Windows :

```bash
npm install express mongoose dotenv cors bcrypt jsonwebtoken zod multer csv-parse
```

Rôle des dépendances :

| Dépendance | Utilité |
|---|---|
| `express` | Créer l'API |
| `mongoose` | Communiquer avec MongoDB |
| `dotenv` | Charger les variables d'environnement |
| `cors` | Autoriser le front React à appeler l'API |
| `bcrypt` | Hasher les mots de passe |
| `jsonwebtoken` | Générer et vérifier les tokens JWT |
| `zod` | Valider les données reçues par l'API |
| `multer` | Gérer l'import de fichiers |
| `csv-parse` | Lire les fichiers CSV |

## 5.3 Installer les dépendances de développement backend

Commande identique sur macOS et Windows :

```bash
npm install -D nodemon jest supertest cross-env
```

Rôle des dépendances de développement :

| Dépendance | Utilité |
|---|---|
| `nodemon` | Redémarrer le serveur automatiquement |
| `jest` | Faire les tests |
| `supertest` | Tester les routes API |
| `cross-env` | Gérer les variables d'environnement dans les scripts |

## 5.4 Créer l'arborescence serveur

### macOS

```bash
mkdir -p src/config src/controllers src/middlewares src/models src/routes src/validations src/tests
touch src/server.js
touch src/config/db.js
touch .env
touch .env.example
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force -Path `
  .\src\config, `
  .\src\controllers, `
  .\src\middlewares, `
  .\src\models, `
  .\src\routes, `
  .\src\validations, `
  .\src\tests

New-Item -ItemType File -Force -Path `
  .\src\server.js, `
  .\src\config\db.js, `
  .\.env, `
  .\.env.example
```

## 5.5 Créer le fichier `.env.example`

### macOS

```bash
cat > .env.example <<'EOF'
PORT=4242
MONGO_URI=mongodb://127.0.0.1:27017/corelab_lms
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
CLIENT_URL=http://localhost:3000
EOF
```

### Windows PowerShell

```powershell
@"
PORT=4242
MONGO_URI=mongodb://127.0.0.1:27017/corelab_lms
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
CLIENT_URL=http://localhost:3000
"@ | Set-Content -Encoding UTF8 .\.env.example
```

## 5.6 Créer le fichier `.env`

### macOS

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .\.env.example .\.env
```

Important : `.env` contient des données sensibles. Il ne faut pas le pousser sur GitHub.

## 5.7 Ajouter les scripts dans `server/package.json`

Commande identique sur macOS et Windows :

```bash
npm pkg set scripts.start="node src/server.js"
npm pkg set scripts.dev="nodemon src/server.js"
npm pkg set scripts.test="jest"
```

Vérifier :

```bash
npm run
```

---

# 6. Installation du client React

Retourner à la racine du projet.

## 6.1 macOS

```bash
cd ..
```

## 6.2 Windows PowerShell

```powershell
cd ..
```

## 6.3 Créer le client avec Vite

Commande identique sur macOS et Windows :

```bash
npm create vite@latest client -- --template react
```

Entrer dans le dossier client :

```bash
cd client
npm install
```

## 6.4 Installer les dépendances frontend

Commande identique sur macOS et Windows :

```bash
npm install axios react-router-dom bootstrap
```

Rôle des dépendances :

| Dépendance | Utilité |
|---|---|
| `axios` | Appeler l'API Express |
| `react-router-dom` | Gérer les pages React |
| `bootstrap` | Créer rapidement le wireframe et le responsive |

## 6.5 Installer les dépendances de test frontend

Commande identique sur macOS et Windows :

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## 6.6 Forcer le client React sur le port 3000

### macOS

Depuis le dossier `client` :

```bash
cat > vite.config.js <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
EOF
```

### Windows PowerShell

Depuis le dossier `client` :

```powershell
@"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
"@ | Set-Content -Encoding UTF8 .\vite.config.js
```

## 6.7 Vérifier les scripts du client

```bash
npm run
```

Normalement, Vite fournit déjà :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

# 7. Créer le fichier `.gitignore`

Retourner à la racine du projet.

## 7.1 macOS

```bash
cd ..
touch .gitignore
cat > .gitignore <<'EOF'
node_modules
.env
.DS_Store
dist
coverage
EOF
```

## 7.2 Windows PowerShell

```powershell
cd ..
New-Item -ItemType File -Force -Path .\.gitignore

@"
node_modules
.env
.DS_Store
dist
coverage
"@ | Set-Content -Encoding UTF8 .\.gitignore
```

---

# 8. Lancer le projet

Il faut ouvrir **deux terminaux** : un pour le serveur, un pour le client.

## 8.1 Démarrer MongoDB

### macOS

```bash
brew services start mongodb-community@8.0
```

### Windows PowerShell

```powershell
Start-Service MongoDB
```

Si le service ne fonctionne pas :

```powershell
New-Item -ItemType Directory -Force -Path C:\data\db
mongod --dbpath C:\data\db
```

## 8.2 Lancer le serveur Express

### macOS

```bash
cd ~/Documents/EPITECH/W-WEB-201-PAR-2-1-corelab-8/server
npm run dev
```

### Windows PowerShell

```powershell
cd $HOME\Documents\EPITECH\W-WEB-201-PAR-2-1-corelab-8\server
npm run dev
```

L'API doit tourner sur :

```txt
http://localhost:4242
```

## 8.3 Lancer le client React

### macOS

```bash
cd ~/Documents/EPITECH/W-WEB-201-PAR-2-1-corelab-8/client
npm run dev
```

### Windows PowerShell

```powershell
cd $HOME\Documents\EPITECH\W-WEB-201-PAR-2-1-corelab-8\client
npm run dev
```

Le client doit tourner sur :

```txt
http://localhost:3000
```

---

# 9. Vérifications rapides

## 9.1 Vérifier la structure

### macOS

```bash
ls
ls client
ls server
ls server/src
```

### Windows PowerShell

```powershell
Get-ChildItem
Get-ChildItem .\client
Get-ChildItem .\server
Get-ChildItem .\server\src
```

## 9.2 Vérifier Git

Commande identique sur macOS et Windows :

```bash
git branch
git status
```

## 9.3 Vérifier Node et npm

Commande identique sur macOS et Windows :

```bash
node -v
npm -v
```

## 9.4 Vérifier MongoDB

### macOS

```bash
mongosh --eval 'db.runCommand({ ping: 1 })'
```

### Windows PowerShell

```powershell
mongosh "mongodb://127.0.0.1:27017" --eval "db.runCommand({ ping: 1 })"
```

---

# 10. Commandes Git après installation

À la racine du projet.

Commande identique sur macOS et Windows :

```bash
git status
git add .
git commit -m "chore: create project structure and install dependencies"
git push
```

Si la branche n'a jamais été poussée :

```bash
git push -u origin develop
```

---

# 11. Commandes utiles pour les branches

## 11.1 Créer une branche de fonctionnalité

```bash
git checkout develop
git pull origin develop
git checkout -b feature/setup-server
```

## 11.2 Pousser la branche

```bash
git push -u origin feature/setup-server
```

## 11.3 Revenir sur `develop`

```bash
git checkout develop
```

---

# 12. Sources utiles

- Node.js : https://nodejs.org/en/download
- npm : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/
- Git Windows : https://git-scm.com/install/windows
- Homebrew : https://brew.sh/
- MongoDB macOS : https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-os-x/
- MongoDB Windows : https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/
- MongoDB Shell : https://www.mongodb.com/docs/mongodb-shell/install/
- Vite : https://vite.dev/guide/
- WinGet : https://learn.microsoft.com/windows/package-manager/winget/ 