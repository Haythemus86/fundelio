# Fundelio — frontend

Application web de Fundelio, construite avec Vue 3, Vue Router et Vite. Elle
communique avec l’API NestJS du dépôt voisin `fundeliobackend`.

## Démarrer le projet sous Windows (guide débutant)

Ce guide explique comment démarrer le site et son API sur un ordinateur Windows.
Il faut lancer le backend et le frontend dans deux fenêtres PowerShell distinctes
et les laisser ouvertes pendant l’utilisation du site.

### 1. Installer les outils nécessaires

Installez les outils suivants si ce n’est pas déjà fait :

- **Node.js LTS**, version 22.12 ou supérieure : <https://nodejs.org/>
- **Docker Desktop pour Windows** : <https://www.docker.com/products/docker-desktop/>

Après l’installation, ouvrez Docker Desktop et attendez qu’il indique que Docker
fonctionne. Pour vérifier les installations, ouvrez PowerShell et tapez :

```powershell
node --version
npm --version
docker --version
docker compose version
```

Si Windows indique qu’une commande est inconnue, fermez puis rouvrez PowerShell.
Si `docker compose version` ne fonctionne toujours pas, vérifiez que Docker
Desktop est installé et démarré.

### 2. Ouvrir PowerShell dans le dossier du projet

Dans l’Explorateur de fichiers, ouvrez le dossier qui contient les deux dossiers
`fundelio` et `fundeliobackend`. Cliquez dans la barre d’adresse en haut,
tapez `powershell`, puis appuyez sur Entrée. Une fenêtre PowerShell s’ouvre à
cet emplacement.

Les commandes ci-dessous sont à taper dans PowerShell, sans recopier les
symboles d’invite de commande. Pour lancer les deux parties, répétez cette
opération afin d’obtenir **deux fenêtres PowerShell**.

### 3. Préparer et démarrer le backend

Dans la première fenêtre, entrez dans le dossier du backend :

```powershell
cd .\fundeliobackend
```

Au premier démarrage seulement, créez le fichier de configuration local,
installez les dépendances, démarrez la base de données et préparez-la :

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install --legacy-peer-deps
docker compose up -d postgres
npm run db:generate
npx prisma migrate deploy
npm run db:seed
```

Le fichier `.env` configure l’API et PostgreSQL en local. Ne le partagez pas et
ne le remplacez pas par le fichier `.env.example`.

Démarrez ensuite le backend :

```powershell
npm run start:dev
```

Laissez cette fenêtre ouverte. Quand l’API fonctionne, l’adresse
<http://localhost:3000/api/health> affiche une réponse de santé.

### 4. Démarrer le frontend

Dans la deuxième fenêtre PowerShell, depuis le dossier qui contient les deux
projets, entrez dans le frontend, installez ses dépendances et démarrez-le :

```powershell
cd .\fundelio
npm install
npm run dev
```

Laissez également cette fenêtre ouverte. Ouvrez dans votre navigateur l’adresse
indiquée par Vite, généralement <http://localhost:5173>.

Le frontend contacte par défaut le backend à l’adresse
`http://localhost:3000/api`. Aucun fichier `.env` n’est nécessaire pour lancer le
frontend en local.

### 5. La prochaine fois et pour arrêter le projet

Après la première installation, démarrez Docker Desktop, puis dans une fenêtre
PowerShell située dans `fundeliobackend`, exécutez :

```powershell
docker compose up -d postgres
npm run start:dev
```

Dans une deuxième fenêtre située dans `fundelio`, exécutez :

```powershell
npm run dev
```

Pour arrêter chaque serveur, cliquez dans sa fenêtre et appuyez sur `Ctrl+C`.
Pour arrêter PostgreSQL, exécutez `docker compose down` depuis le dossier
`fundeliobackend`. Cela conserve les données de la base.

### En cas de problème

- Si le site ne charge pas les données, vérifiez que Docker Desktop et les deux
  fenêtres de serveurs sont toujours ouverts, puis rechargez la page.
- Si `npm` ou `node` n’est pas reconnu, installez Node.js puis ouvrez une
  nouvelle fenêtre PowerShell.
- Si Docker ne démarre pas, ouvrez Docker Desktop et attendez que son moteur
  soit prêt avant de relancer `docker compose up -d postgres`.
- Si un message indique qu’un port est déjà utilisé, un autre programme utilise
  probablement ce port. Ne modifiez pas les ports dans `.env` sans mettre à jour
  aussi l’URL de connexion à la base correspondante.

## Développement

Depuis le dossier `fundelio` :

```powershell
npm run test
npm run lint
npm run build
```

## Espace compte

Les routes `/compte/profil` et `/compte/cagnottes` sont réservées aux personnes
connectées. Le profil permet de modifier les informations personnelles, de
changer le mot de passe, de gérer une photo et de supprimer le compte. L’adresse
email est affichée sans être modifiable. La suppression anonymise le compte tout
en conservant les cagnottes et contributions nécessaires à l’historique.

La gestion des cagnottes affiche uniquement celles de la personne connectée.
Les sections des maquettes non encore prises en charge (pétitions, sondages,
transactions et justificatifs) sont signalées comme indisponibles, sans données
de démonstration ni flux de paiement.

En développement, les photos sont enregistrées dans `fundeliobackend/uploads/`
et servies par l’API. Ce stockage local ne convient pas à plusieurs instances ou
à la production : un stockage persistant partagé devra être configuré avant
déploiement.
