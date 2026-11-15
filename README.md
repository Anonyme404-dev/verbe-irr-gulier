# 📘 Verbes Irréguliers

Site de révision des **190 verbes irréguliers anglais** : quiz, répétition espacée, listes personnalisées et prononciation en anglais. Il fonctionne sur téléphone et sur PC, et s'installe comme une application (PWA) qui marche **hors-ligne**.

Tout est en HTML, CSS et JavaScript, sans bibliothèque ni serveur : il suffit d'héberger les fichiers (par exemple sur GitHub Pages).

## Sommaire

1. [Fonctionnalités](#-fonctionnalités)
2. [Fichiers du projet](#-fichiers-du-projet)
3. [Mise en ligne et mises à jour](#-mise-en-ligne-et-mises-à-jour)
4. [Modifier les verbes](#-modifier-les-verbes)
5. [Importer et exporter des listes (JSON)](#-importer-et-exporter-des-listes-json)
6. [Données enregistrées](#-données-enregistrées)
7. [Robustesse et accessibilité](#-robustesse-et-accessibilité)
8. [Facultatif : héberger la police soi-même](#-facultatif--héberger-la-police-poppins-soi-même)
9. [Limites connues](#-limites-connues)
10. [Historique](#-historique)

---

## ✨ Fonctionnalités

### 🎯 Mode Quiz
- Quatre cases toujours dans le même ordre : **Base, Prétérit, Participe passé, Traduction**.
- Un des quatre éléments est donné en **indice**, pré-rempli à sa place. Tu remplis les trois autres.
- Correction case par case (vert ou rouge), avec la bonne réponse affichée.
- Les variantes sont acceptées : `burnt` ou `burned`, `was` ou `were`. La forme complète (`was/were`) l'est aussi.
- Les majuscules, les accents et les parenthèses sont ignorés.
- Deux modes : **🧠 Répétition espacée** (recommandé) et **🎲 Au hasard**.
- Score, série de bonnes réponses, nombre de verbes « à revoir » et barre de maîtrise.
- Le quiz **reprend où tu l'as laissé**, y compris le texte déjà tapé.
- Sur téléphone, le clavier ne s'ouvre pas tout seul. Sur PC, le curseur se place automatiquement.

### 🧠 Répétition espacée
- Chaque verbe a un niveau de 0 à 4. Une bonne réponse le fait monter, et il revient après **1, 3, 7 puis 14 jours**. Une erreur le remet au niveau 0.
- Un verbe raté revient dans la même session, après 3 questions, au plus une fois sur deux (pour ne pas bloquer les autres verbes).
- Les verbes les moins bien maîtrisés sont tirés plus souvent.

### 📖 Mode Liste
- Les 190 verbes, avec recherche (sans tenir compte des accents) et boutons **Masquer** une colonne pour t'auto-tester. Un clic sur une case masquée la révèle.
- **Téléphone (moins de 700 px)** : une carte par verbe, en 2×2.
- **PC (700 px et plus)** : un tableau.
- Barre de lettres **A à Z** facultative (désactivée par défaut).

### ➕ Listes personnalisées
- Le bouton **＋** crée une liste : un nom et les verbes à apprendre.
- Chaque liste a son **onglet** dans le mode liste et dans le mode quiz. En mode quiz, le score, les verbes à revoir et la maîtrise se calculent sur la liste choisie.
- En mode liste, une liste peut être modifiée ou supprimée.
- Les listes peuvent être importées et exportées en fichier JSON (voir plus bas).

### 🔊 Prononciation
- Voix en anglais grâce à la synthèse vocale du navigateur (`speechSynthesis`), gratuite et sans bibliothèque.
- Elle est **désactivée par défaut** : active « Bouton écouter » dans les paramètres. Les boutons 🔊 apparaissent alors dans la liste et dans le quiz. **Seul le bouton prononce.**
- Accent au choix : Auto, Américaine ou **Britannique (par défaut)**, avec un bouton « Tester la voix » et l'affichage de la voix utilisée.
- Les voix dépendent de ton appareil. Si aucune voix anglaise n'est détectée, installe-la dans les réglages « Synthèse vocale » du téléphone.

### ⚙️ Paramètres (roue en haut à droite)
| Réglage | Par défaut |
|---|---|
| Bouton « écouter » 🔊 | désactivé |
| Écouter les 3 formes (après chaque réponse du quiz) | désactivé |
| Barre de lettres A–Z | désactivée |
| Accent de la voix | Britannique |
| Thème (Auto, Clair, Sombre) | Auto |
| Mes listes : importer / exporter | — |
| Réinitialiser ma progression | — |

### 📲 Application installable (PWA)
- Installable depuis Chrome, Edge ou Brave (« Installer l'application » ou « Ajouter à l'écran d'accueil »).
- Fonctionne **hors-ligne** après la première visite.
- Si tu l'as déjà installée avec une ancienne icône, désinstalle-la puis réinstalle-la pour voir la nouvelle.

---

## 📁 Fichiers du projet

| Fichier | Rôle |
|---|---|
| `index.html` | La page : structure, textes, fenêtres |
| `style.css` | Le style (couleurs, thèmes clair et sombre, mise en page) |
| `app.js` | La logique : quiz, répétition espacée, listes, paramètres, import/export |
| `verbs.js` | **Les 190 verbes** (le fichier à modifier pour changer les données) |
| `sw.js` | Service worker : mode hors-ligne |
| `manifest.json` | Description de l'application (nom, couleurs, icônes) |
| `icon-192.png`, `icon-512.png` | Icônes (logo rond « VERBS », fond transparent) |
| `icon-maskable-192.png`, `icon-maskable-512.png` | Versions sur fond blanc pour les icônes arrondies d'Android |
| `apple-touch-icon.png` | Icône de l'écran d'accueil de l'iPhone et de l'iPad |
| `README.md` | Ce fichier |

Tous les fichiers doivent être dans **le même dossier**, avec ces noms exacts.

---

## 🚀 Mise en ligne et mises à jour

### Mise en ligne (GitHub Pages)
1. Mets tous les fichiers du projet dans un dépôt GitHub (à la racine ou dans un dossier).
2. Dans le dépôt : **Settings > Pages**, choisis la branche et le dossier, puis enregistre.
3. Le site est disponible à l'adresse `https://<utilisateur>.github.io/<dépôt>/`.

Le HTTPS est obligatoire pour le mode hors-ligne, et GitHub Pages le fournit. Pour tester en local, utilise un petit serveur (`python3 -m http.server` puis `http://localhost:8000`) : le service worker ne fonctionne pas en ouvrant `index.html` par double-clic.

### Mettre à jour le site
1. Remplace les fichiers modifiés dans le dépôt.
2. Attends une ou deux minutes que GitHub Pages publie, puis **actualise la page une fois**.

En ligne, le service worker va toujours chercher la dernière version des fichiers. Hors-ligne, il utilise la copie en cache. Tu n'as donc **pas besoin de changer de numéro de version** pour une simple modification.

Change `const CACHE = 'verbes-v12'` dans `sw.js` (par exemple en `'verbes-v13'`) seulement si tu **ajoutes, renommes ou supprimes un fichier** : pense alors à mettre à jour la liste `ASSETS` juste au-dessus.

---

## 🛠️ Modifier les verbes

Les verbes sont dans `verbs.js`, un par ligne :

```
Base|Prétérit|Participe passé|Traduction
```

- Plusieurs formes possibles : sépare-les par `/` (`Burnt/burned`).
- Plusieurs traductions : sépare-les par une virgule (`Voler, dérober`).
- Une précision entre parenthèses est ignorée à la correction (`Porter (habits)`).
- Chaque base doit être **unique**. La liste est triée automatiquement par ordre alphabétique.

---

## 📥 Importer et exporter des listes (JSON)

Un fichier JSON permet de créer plusieurs listes d'un coup, de les sauvegarder, ou de les copier d'un appareil à l'autre.

### Importer
- Bouton **📥** (à côté du ＋) ou **Paramètres > Mes listes > Importer**, puis choisis un fichier `.json`.
- Chaque liste du fichier est créée et apparaît en onglet dans le mode liste et dans le mode quiz.
- Si une liste du fichier a le même nom qu'une liste existante, elle est **mise à jour** (pas de doublon).
- **Un verbe déjà présent sur le site garde ses formes et sa traduction** : celles du fichier sont ignorées.
- Un verbe **absent** du site est ajouté, s'il a ses quatre champs. Sinon il est ignoré, et le message de fin d'import l'indique.
- Limites : 100 listes, 500 verbes par liste, fichier de 2 Mo maximum.

### Exporter
**Paramètres > Mes listes > Exporter** télécharge `verbes_irreguliers.json` avec toutes tes listes. Ce fichier peut être ré-importé tel quel.

### ✍️ Créer un fichier JSON pas à pas

**1. Ouvre un éditeur de texte.** Le Bloc-notes de Windows convient, ainsi que VS Code ou l'application « Notes » du téléphone (choisis du texte brut).

**2. Copie ce modèle :**

```json
{
  "listes": [
    {
      "title": "Liste 1 (jeudi 15 octobre)",
      "tableaux": [1, 4, 5],
      "verbes": [
        { "base": "Be", "preterit": "Was/were", "participe_passe": "Been", "traduction": "Être" },
        { "base": "Find", "preterit": "Found", "participe_passe": "Found", "traduction": "Trouver" }
      ]
    }
  ]
}
```

**3. Remplis-le.**

| Champ | Rôle | Obligatoire ? |
|---|---|---|
| `title` | Nom de la liste (il s'affiche sur l'onglet) | Non (un nom est généré sinon) |
| `tableaux` | Numéros de tableaux de ton cours, affichés sous le nom | Non |
| `base` | Le verbe à l'infinitif (`Go`) | **Oui** |
| `preterit`, `participe_passe`, `traduction` | Les autres formes | **Seulement pour un verbe absent du site** |

**4. Version courte.** Comme les verbes déjà sur le site gardent leurs formes, tu peux écrire seulement la base. Cet exemple est valide :

```json
{
  "listes": [
    {
      "title": "Révision de jeudi",
      "verbes": [ { "base": "Go" }, { "base": "Take" }, { "base": "Write" } ]
    }
  ]
}
```

**5. Les règles à respecter :**
- Utilise des guillemets droits `"` (pas `“ ”`), autour des noms de champs et des textes.
- Mets une **virgule** entre deux éléments, mais **pas après le dernier**.
- Chaque `{` doit avoir son `}`, et chaque `[` son `]`.
- Les noms de champs s'écrivent exactement comme dans le modèle, sans accent : `preterit`, `participe_passe`, `traduction`. Les variantes `titre`, `participe` et `translation` sont aussi reconnues.

**6. Enregistre-le** sous un nom qui finit par `.json` (par exemple `mes_listes.json`), en **UTF-8** pour garder les accents. Dans le Bloc-notes, choisis « Tous les fichiers » comme type et l'encodage « UTF-8 ».

**7. Importe-le** avec le bouton 📥. Si le fichier a une erreur, le site affiche « Fichier non reconnu » : relis les règles de l'étape 5. Tu peux aussi coller le contenu sur un site de vérification comme jsonlint.com, qui indique la ligne de l'erreur.

**Astuce :** demande à un assistant (ChatGPT, Claude...) de te générer le fichier à partir de ta liste de verbes, en lui donnant le modèle ci-dessus.

---

## 💾 Données enregistrées

Tout est enregistré dans le navigateur de l'appareil (`localStorage`). Il n'y a **pas de comptes** et rien n'est envoyé sur internet.

| Clé | Contenu |
|---|---|
| `srs` | Progression de la répétition espacée |
| `session` | Quiz en cours (verbe, texte tapé, score, liste choisie) |
| `lists` | Listes personnalisées |
| `customVerbs` | Verbes ajoutés par un import (absents de `verbs.js`) |
| `settings` | Paramètres (avec un numéro de version `v`) |
| `hiddenCols` | Colonnes masquées en mode liste |

Vider les données du site dans le navigateur efface tout cela. **Exporte tes listes de temps en temps** pour en garder une copie.

Quand les réglages par défaut changent, le numéro de version `v` de `settings` permet de les appliquer une seule fois, sans écraser les autres choix.

---

## 🛡️ Robustesse et accessibilité

### Robustesse
- Des données enregistrées abîmées (mauvais format, valeurs invalides) sont ignorées : le site démarre avec les valeurs par défaut.
- Si le navigateur refuse le stockage (navigation privée), le site fonctionne quand même, avec des données gardées en mémoire pour la session.
- Si l'horloge de l'appareil est reculée, les échéances de la répétition espacée trop lointaines sont ramenées à « maintenant ».
- Les fichiers importés sont limités en taille et en nombre, et leur contenu est affiché comme du **texte** : un fichier piégé ne peut pas exécuter de code.
- Le service worker prend toujours la dernière version en ligne et garde le site utilisable hors-ligne.

### Accessibilité
- Navigation au clavier avec un contour de focus visible.
- Onglets, sélecteurs et listes annoncés correctement aux lecteurs d'écran (`aria-selected`, `aria-pressed`, étiquettes).
- Respect du réglage « réduire les animations » du système.
- Thèmes clair et sombre, avec des contrastes lisibles.

---

## 🔤 Facultatif : héberger la police Poppins soi-même

Le site charge la police Poppins depuis Google Fonts. Elle est ensuite mise en cache pour le hors-ligne, et un jeu de polices système prend le relais si elle manque. Pour ne plus dépendre de Google :

1. Télécharge les fichiers `woff2` de Poppins (graisses 400, 600, 700) sur **gwfh.mranftl.com** (google-webfonts-helper) et mets-les dans un dossier `fonts/`.
2. Ajoute dans `style.css` (une règle par graisse) :
   ```css
   @font-face {
     font-family: 'Poppins';
     font-weight: 400;
     font-display: swap;
     src: url('fonts/poppins-400.woff2') format('woff2');
   }
   ```
3. Supprime les trois lignes `fonts.googleapis.com` / `fonts.gstatic.com` de `index.html`.
4. Ajoute les fichiers de police à la liste `ASSETS` de `sw.js` et change le numéro de `CACHE`.

---

## ⚠️ Limites connues
- Les listes et la progression restent sur l'appareil : elles ne se retrouvent pas d'un appareil à l'autre, sauf par export puis import.
- La voix dépend des voix installées sur l'appareil.
- Les traductions et les variantes des verbes ont été écrites de mémoire : relis-les dans `verbs.js` si tu veux une liste fidèle à ton cours.

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
| `v8` | Bouton 🔊 de retour sur PC |
| `v9` | Nouveau logo « VERBS » pour l'icône |
| `v10` | Seul le bouton 🔊 prononce ; par défaut : voix britannique, bouton 🔊 désactivé, thème automatique |
| `v11` | Import et export JSON des listes |
| `v12` | **Version finale** : code découpé en `index.html`, `style.css`, `app.js` et `verbs.js` ; import qui garde les traductions du site ; service worker « réseau d'abord » ; protections contre les données abîmées ; accessibilité |
