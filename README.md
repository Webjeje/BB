# 🏀 BasketStat PWA — Compteur de Stats & Coach IA

> **Une application web progressive (PWA)** pour suivre les performances en basketball et bénéficier d’un coaching intelligent grâce à l’IA Gemini.

🔗 **Démo IA associée :**  
https://www.webjeje.com/online/webapp/bbpwa/

---

## 🎯 Présentation

**BasketStat** est une Progressive Web App (PWA) conçue pour les **entraîneurs**, **joueurs** et **professeurs d’EPS** afin de suivre et d’analyser les performances lors d’un match ou d’un entraînement de basketball.

Développée en **Vanilla JavaScript**, elle fonctionne **entièrement hors ligne** et intègre une **analyse par Intelligence Artificielle (IA)** basée sur **Google Gemini**, fournissant des conseils de coaching **personnalisés et pédagogiquement adaptés**.

> L’objectif : transformer des données brutes en **leviers de progression tangibles** pour les sportifs de tous niveaux.

---

## ✨ Fonctionnalités Clés

### 📈 Suivi Statistique Complet
Enregistrez 5 types d’actions fondamentales :
- Passe perdue / réussie  
- Cercle touché  
- Panier marqué  
- Interception  

Le système de points valorise l’offensive **et** la défensive, offrant une **vision équilibrée de la performance**.

---

### 📊 Tableau de Bord en Temps Réel
Visualisez instantanément :
- Total des points  
- Nombre d’actions  
- Ratio d’actions par minute (APM)  

> Permet des ajustements tactiques immédiats pendant le match ou la séance.

---

### ⏱️ Chronomètre Intégré
Démarrez, mettez en pause, reprenez.  
Un outil essentiel pour **structurer les entraînements** et **simuler les conditions réelles de match**.

---

### ↩️ Contrôle Total sur les Données
- Annulez (Undo) ou rétablissez (Redo) n’importe quelle action.  
- Réinitialisez la session d’un simple clic.  
> La précision est primordiale : aucun faux pas dans les statistiques !

---

### 🤖 Coach IA Pédagogique (Gemini)
Au-delà des chiffres, l’IA fournit :
- Une **analyse de performance détaillée**  
- Des **axes de progression personnalisés**  
- Des **exercices concrets** adaptés au niveau scolaire (collège / lycée)

Les prompts sont **spécifiquement conçus pour l’éducation**, en cohérence avec les **objectifs didactiques officiels**.

---

### 📴 Mode Hors Ligne Robuste
Grâce à la technologie **PWA + Service Workers**, l’application fonctionne **à 100% sans connexion** après le premier chargement.  
> Idéal pour les gymnases ou terrains sans réseau.

---

### 💾 Stockage Local et Privé
Les sessions sont enregistrées dans le **navigateur** via **IndexedDB**, garantissant :
- Une **persistance locale**  
- Une **confidentialité totale**  
> Aucune donnée n’est transmise à un serveur distant.

---

### 📤 Export & Partage Faciles
- Export CSV complet pour une analyse à long terme  
- Partage instantané via **QR Code**  
> Parfait pour un débriefing rapide avec les joueurs ou collègues.

---

### 📱 Interface Mobile-First
Pensée pour une **utilisation rapide sur smartphone**, même à une main :  
- Grands boutons  
- Ergonomie intuitive  
- Lisibilité maximale en extérieur

---

## 🛠️ Technologies Utilisées

| Composant | Technologie | Rôle |
|------------|-------------|------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Application légère et rapide sans framework |
| **Base de données locale** | IndexedDB | Gestion asynchrone de données structurées |
| **PWA** | Service Workers & Manifest | Cache, mode hors ligne et installation sur mobile |
| **Analyse IA** | API Google Gemini | Génération d’analyses et de conseils personnalisés |
| **Backend (proxy)** | PHP | Intermédiaire sécurisé pour protéger la clé API |

---

## 🚀 Installation et Lancement

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/VOTRE-NOM-UTILISATEUR/VOTRE-DEPOT.git
cd VOTRE-DEPOT
