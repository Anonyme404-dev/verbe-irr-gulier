# 📘 Verbes Irréguliers

Site de révision des **190 verbes irréguliers anglais**, avec quiz, répétition espacée, prononciation en anglais et listes personnalisées. Il fonctionne sur téléphone et sur PC, et s'installe comme une application (PWA) avec un mode hors-ligne.

Tout est en HTML, CSS et JavaScript, sans bibliothèque ni serveur : il suffit d'héberger les fichiers (par exemple sur GitHub Pages).

---

## ✨ Fonctionnalités

### 🎯 Mode Quiz
- Quatre cases toujours dans le même ordre : **Base, Prétérit, Participe passé, Traduction**.
- Un des quatre éléments est donné en **indice**, pré-rempli à sa place. Tu remplis les trois autres.
- Correction case par case (vert ou rouge) avec la bonne réponse affichée.
- Les variantes sont acceptées : `burnt` ou `burned`, `was` ou `were`. La forme complète (`was/were`) l'est aussi.
- Les majuscules, les accents et les parenthèses sont ignorés.
- Deux modes :
  - **🧠 Répétition espacée** (recommandé) : les verbes ratés reviennent plus souvent.
  - **🎲 Au hasard** : tous les verbes de la liste choisie.
- Score, série de bonnes réponses, nombre de verbes « à revoir » et barre de maîtrise.
- Le quiz **reprend où tu l'as laissé** quand tu reviens sur le site, y compris le texte déjà tapé.

### 🧠 Répétition espacée
- Chaque verbe a un niveau de 0 à 4. Une bonne réponse le fait monter, et il revient après **1, 3, 7 puis 14 jours**. Une erreur le remet au niveau 0.
- Un verbe raté revient dans la même session après 3 questions, au plus une fois sur deux, pour ne pas bloquer les autres verbes.
- Les verbes les moins bien maîtrisés sont tirés plus souvent.

### 📖 Mode Liste
- Les 190 verbes, avec recherche (sans tenir compte des accents) et boutons **Masquer** une colonne pour t'auto-tester. Un clic sur une case masquée la révèle.
- **Téléphone (écran de moins de 700 px)** : une carte par verbe, en 2×2, avec un bouton 🔊.
- **PC (700 px et plus)** : un tableau, avec un bouton 🔊 à droite de chaque mot anglais. Un clic sur le mot le prononce aussi.
- Barre de lettres **A à Z** facultative (désactivée par défaut).

### ➕ Listes personnalisées
- Le bouton **＋** crée une liste : un nom et les verbes à apprendre.
- Chaque liste a son **onglet** dans le mode liste et dans le mode quiz.
- En mode liste, une liste peut être modifiée ou supprimée.
- En mode quiz, le score, les verbes à revoir et la maîtrise se calculent sur la liste choisie.
- Les listes sont enregistrées **sur l'appareil** : elles ne se retrouvent pas d'un appareil à l'autre.

### 🔊 Prononciation
- Voix en anglais grâce à la synthèse vocale du navigateur (`speechSynthesis`), gratuite et sans bibliothèque.
- Choix de l'accent dans les paramètres : Auto, Américaine ou Britannique, avec un bouton « Tester la voix » et l'affichage de la voix utilisée.
- Les voix dépendent de ton appareil. Si aucune voix anglaise n'est détectée, installe-la dans les réglages « Synthèse vocale » du téléphone.

### ⚙️ Paramètres (roue en haut à droite)
| Réglage | Par défaut |
|---|---|
| Bouton « écouter » 🔊 | activé |
| Écouter les 3 formes (après chaque réponse du quiz) | désactivé |
| Barre de lettres A–Z | désactivée |
| Accent de la voix | Auto |
| Thème (Auto, Clair, Sombre) | Auto |
| Réinitialiser ma progression | — |

Désactiver le bouton « écouter » 🔊 le fait disparaître partout (téléphone et PC) et coupe la prononciation.

### 📲 Application installable (PWA)
- Installable depuis Chrome, Edge ou Brave (« Installer l'application » ou « Ajouter à l'écran d'accueil »).
- Fonctionne **hors-ligne** après la première visite.
- Le clavier ne s'ouvre pas tout seul sur téléphone ; le curseur se place automatiquement seulement sur PC.

---

## 📁 Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le site : page, style et code |
| `manifest.json` | Description de l'application (nom, couleurs, icônes) |
| `sw.js` | Service worker : cache et mode hors-ligne |
| `icon-192.png`, `icon-512.png` | Icônes de l'application |
| `README.md` | Ce fichier |

---

## 🚀 Mise en ligne (GitHub Pages)

1. Mets les 5 fichiers de l'application dans un dépôt GitHub (à la racine ou dans un dossier).
2. Dans le dépôt : **Settings > Pages**, choisis la branche et le dossier, puis enregistre.
3. Le site est disponible à l'adresse `https://<utilisateur>.github.io/<dépôt>/`.

Le HTTPS est obligatoire pour le mode hors-ligne, et GitHub Pages le fournit. Pour tester en local, utilise `http://localhost` : le service worker ne fonctionne pas en ouvrant `index.html` par double-clic.

### 🔄 Mettre à jour le site
1. Remplace `index.html` (et les autres fichiers modifiés) dans le dépôt.
2. Dans `sw.js`, **change le numéro de version** du cache : `const CACHE = 'verbes-v8';` devient `'verbes-v9'`, et ainsi de suite.
3. Sur l'appareil, **recharge la page deux fois** : la première charge les nouveaux fichiers, la seconde les affiche.

---

## 🛠️ Modifier les données

### Ajouter ou corriger un verbe
Les verbes sont au début du script de `index.html`, dans `RAW`, un par ligne :

```
Base|Prétérit|Participe|Traduction
```

- Plusieurs formes possibles : sépare-les par `/` (`Burnt/burned`).
- Plusieurs traductions : sépare-les par une virgule (`Voler, dérober`).
- Une précision entre parenthèses est ignorée à la correction (`Porter (habits)`).
- Chaque base doit être **unique**. La liste est triée automatiquement par ordre alphabétique.

### Données enregistrées dans le navigateur (`localStorage`)
| Clé | Contenu |
|---|---|
| `srs` | Progression de la répétition espacée |
| `session` | Quiz en cours (verbe, texte tapé, score, liste choisie) |
| `lists` | Listes personnalisées |
| `settings` | Paramètres |
| `hiddenCols` | Colonnes masquées en mode liste |

Vider les données du site dans le navigateur efface tout cela.

---

## ⚠️ Limites connues
- Les listes et la progression restent sur l'appareil. Il n'y a **pas de comptes** : l'idée a été abandonnée.
- La voix dépend des voix installées sur l'appareil, et elle n'a pas pu être testée sur tous les téléphones.
- Les traductions et les variantes ont été écrites de mémoire : relis-les si tu veux une liste fidèle à ton cours.

---

## 📝 Historique

| Version du cache | Changements |
|---|---|
| avant `v1` | Quiz et liste de base (26 verbes), répétition espacée, prononciation anglaise, PWA |
| `v1` | Mode hors-ligne (service worker) |
| `v2` | Paramètres, sauvegarde du quiz, nouveau style |
| `v3` | Quiz à 4 champs dans l'ordre, 190 verbes, sélecteur de mode |
| `v4` | Choix de la voix et de l'accent, tableau en mode liste |
| `v5` | Cartes téléphone avec 🔊, listes personnalisées, barre A–Z en option |
| `v6` | Plus de clavier automatique sur téléphone |
| `v7` | Comptes retirés, débordement des cartes corrigé, formes complètes acceptées |
| `v8` | Bouton 🔊 de retour sur PC (il disparaît quand la voix est désactivée) |
