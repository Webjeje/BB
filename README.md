BasketStat PWA - Compteur de Stats & Coach IA
BasketStat est une Progressive Web App (PWA) conçue pour les entraîneurs, les joueurs et les professeurs d'EPS afin de suivre et d'analyser les performances lors d'un match ou d'un entraînement de basketball. Développée en Vanilla JS, elle est rapide, fonctionne entièrement hors ligne et intègre une analyse par Intelligence Artificielle pour fournir des conseils de coaching personnalisés et pédagogiquement adaptés. L'objectif est de transformer des données brutes en un levier de progression tangible pour les sportifs de tous niveaux.

✨ Fonctionnalités Clés
📈 Suivi Statistique Complet : Enregistrez 5 types d'actions fondamentales (passe perdue/réussie, cercle touché, panier marqué, interception). Le système de points est pensé pour valoriser à la fois l'offensive et la défensive, offrant une vision équilibrée de la performance.

📊 Tableau de Bord en Temps Réel : Visualisez instantanément les indicateurs de performance clés : le total des points, le nombre d'actions et le ratio d'actions par minute (APM). Cet affichage direct permet des ajustements tactiques immédiats pendant une session.

⏱️ Chronomètre Intégré : Gérez précisément le temps de jeu avec les fonctions Démarrer, Pause et Reprendre, un outil essentiel pour structurer les entraînements et simuler des conditions de match.

↩️ Contrôle Total sur les Données : La précision est primordiale. Annulez (Undo) ou rétablissez (Redo) n'importe quelle action pour corriger les erreurs de saisie en direct. Réinitialisez la session d'un simple clic pour commencer une nouvelle analyse.

🤖 Analyse par Coach IA Pédagogique : Allez au-delà des chiffres. Obtenez une analyse de performance détaillée et des axes de progression personnalisés, générés par l'API Gemini de Google. Les prompts envoyés à l'IA sont spécifiquement conçus pour s'adapter au niveau scolaire de l'élève (collège ou lycée), en s'appuyant sur les objectifs didactiques officiels. Le coach IA ne se contente pas de commenter les stats, il propose des exercices concrets.

** offline️ Mode Hors Ligne Robuste :** Grâce à la technologie PWA et aux Service Workers, l'application est 100% fonctionnelle sans connexion Internet après le premier chargement. Idéal pour les gymnases ou les terrains extérieurs où la connectivité est faible ou inexistante.

💾 Stockage Local et Privé : Toutes les données de vos sessions sont sauvegardées de manière persistante et sécurisée dans votre navigateur grâce à IndexedDB, une base de données locale puissante. Vos informations restent sur votre appareil.

📤 Export et Partage Faciles : Exportez l'historique complet des actions au format CSV pour une analyse à long terme ou pour l'intégrer dans d'autres outils. Partagez les statistiques clés de la session en un instant via un QR Code, parfait pour un débriefing rapide avec les joueurs.

📱 Conception Mobile-First : L'interface est épurée et pensée pour une utilisation rapide sur smartphone, même à une main depuis le banc de touche. Les boutons sont larges et l'ergonomie est optimisée pour le terrain.

🛠️ Technologies Utilisées
Frontend : HTML5, CSS3, JavaScript (ES6+). Le choix d'une approche sans framework ("Vanilla JS") garantit une légèreté maximale, des temps de chargement quasi instantanés et une maintenance simplifiée, sans nécessiter d'étape de compilation.

Stockage de données : IndexedDB. Préférée à localStorage pour sa capacité à gérer de grandes quantités de données structurées de manière asynchrone, ce qui évite de ralentir l'interface utilisateur.

PWA : Service Workers & Manifest. Le Service Worker agit comme un proxy intelligent, interceptant les requêtes réseau pour mettre en cache les ressources de l'application et permettre son fonctionnement hors ligne.

Analyse IA : API Google Gemini. L'une des IA les plus avancées est mise à contribution pour générer des analyses pertinentes et de haute qualité.

Backend (Proxy) : PHP. Un simple script PHP sert d'intermédiaire sécurisé entre l'application et l'API de Google. Cette méthode est cruciale car elle permet de masquer la clé API sur le serveur, la protégeant ainsi de toute exposition côté client.

🚀 Installation et Lancement
Pour lancer l'application en local et faire fonctionner l'analyse IA, suivez ces étapes détaillées :

1. Cloner le Dépôt
Utilisez Git pour copier tous les fichiers du projet sur votre machine locale.

git clone [https://github.com/VOTRE-NOM-UTILISATEUR/VOTRE-DEPOT.git](https://github.com/VOTRE-NOM-UTILISATEUR/VOTRE-DEPOT.git)
cd VOTRE-DEPOT

2. Configurer le Proxy et la Clé API
Cette étape est essentielle pour que l'application puisse communiquer avec l'intelligence artificielle de Google.

Créez le fichier proxy.php à la racine de votre projet.

Copiez le contenu du fichier proxy.php fourni dans le projet.

Obtenez votre clé API Gemini gratuitement sur Google AI Studio.

Collez votre clé dans le fichier proxy.php à la place de VOTRE_CLÉ_API_PERSONNELLE.... Il est fortement recommandé de ne jamais partager cette clé.

// Fichier: proxy.php
// ...
$apiKey = 'VOTRE_CLÉ_API_PERSONNELLE_COMMENÇANT_PAR_AIza...'; // <-- COLLEZ VOTRE CLÉ ICI
// ...

3. Lancer avec un Serveur Local
Pour des raisons de sécurité (politique CORS des navigateurs), les requêtes JavaScript vers des fichiers locaux (comme proxy.php) sont bloquées. Il est donc impératif d'utiliser un serveur web local.

Avec Visual Studio Code : La méthode la plus simple est d'installer l'extension Live Server. Une fois installée, faites un clic droit sur index.html et choisissez "Open with Live Server".

Sans VS Code : Si vous avez PHP installé sur votre machine, naviguez jusqu'au dossier du projet dans votre terminal et lancez la commande : php -S localhost:8000.

L'application sera alors accessible à une adresse comme http://127.0.0.1:5500 ou http://localhost:8000.

📂 Structure des Fichiers
index.html: Structure principale et squelette de l'application.

style.css: Styles de l'interface, couleurs et mise en page.

app.js: Cœur de l'application, gestion des événements et appels à l'IA.

db.js: Module de gestion de la base de données locale IndexedDB.

proxy.php: Script serveur sécurisé pour les appels à l'API Gemini.

sw.js: Service Worker qui gère le cache et le mode hors ligne.

sw-register.js: Petit script qui enregistre le Service Worker dans le navigateur.

manifest.json: Fichier de configuration qui définit l'application en tant que PWA (icône, nom, etc.).

📄 Licence
Ce projet est sous licence MIT. Cela signifie que vous êtes libre de l'utiliser, de le modifier et de le distribuer, même à des fins commerciales. Voir le fichier LICENSE pour plus de détails.
