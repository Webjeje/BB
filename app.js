// app.js - Logique principale de l'application BasketStat, optimisée.

document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES ---
    const ICONS = {
        PLAY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>',
        PAUSE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>',
    };

    const STRINGS = {
        START: 'Démarrer',
        RESUME: 'Reprendre',
        PAUSE: 'Pause',
        CONFIRM_RESET: 'Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible.'
    };

    // --- SÉLECTION DES ÉLÉMENTS DU DOM (Caching) ---
    const ui = {
        playerName: document.getElementById('playerName'),
        observerName: document.getElementById('observerName'),
        totalPoints: document.getElementById('totalPoints'),
        totalActions: document.getElementById('totalActions'),
        apm: document.getElementById('apm'),
        timer: document.getElementById('timer'),
        actionButtonsGrid: document.getElementById('action-buttons-grid'),
        startStopBtn: document.getElementById('startStopBtn'),
        resetBtn: document.getElementById('resetBtn'),
        undoBtn: document.getElementById('undoBtn'),
        redoBtn: document.getElementById('redoBtn'),
        exportBtn: document.getElementById('exportBtn'),
        qrCodeBtn: document.getElementById('qrCodeBtn'),
        analysisBtn: document.getElementById('analysisBtn'),
        aiModal: document.getElementById('ai-modal'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        modalBody: document.getElementById('modal-body'),
    };

    // --- ÉTAT DE L'APPLICATION ---
    let state = {
        history: [],
        redoStack: [],
        timerInterval: null,
        elapsedTime: 0,
        isRunning: false
    };

    // --- FONCTIONS DE MISE À JOUR DE L'UI ---

    /** Met à jour tous les affichages de statistiques. */
    function updateStatsDisplay() {
        const totalPoints = state.history.reduce((sum, action) => sum + action.points, 0);
        const totalActions = state.history.length;
        const minutes = state.elapsedTime / 60;
        const apm = minutes > 0 ? (totalActions / minutes).toFixed(1) : '0.0';

        ui.totalPoints.textContent = totalPoints;
        ui.totalActions.textContent = totalActions;
        ui.apm.textContent = apm;

        ui.undoBtn.disabled = state.history.length === 0;
        ui.redoBtn.disabled = state.redoStack.length === 0;
        ui.analysisBtn.disabled = state.history.length < 5;
    }

    /** Met à jour l'affichage du bouton start/stop. */
    function updateTimerButton() {
        if (state.isRunning) {
            ui.startStopBtn.innerHTML = `${ICONS.PAUSE} <span>${STRINGS.PAUSE}</span>`;
            ui.startStopBtn.classList.add('danger');
            ui.startStopBtn.title = `Mettre ${STRINGS.PAUSE.toLowerCase()} le chronomètre`;
        } else {
            const label = state.elapsedTime > 0 ? STRINGS.RESUME : STRINGS.START;
            ui.startStopBtn.innerHTML = `${ICONS.PLAY} <span>${label}</span>`;
            ui.startStopBtn.classList.remove('danger');
            ui.startStopBtn.title = `${label} le chronomètre`;
        }
    }

    /** Formate le temps en secondes au format HH:MM:SS. */
    function formatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // --- LOGIQUE MÉTIER ---

    /** Gère l'ajout d'une nouvelle action. */
    async function handleAction(type, points) {
        if (!state.isRunning) return;

        const action = { type, points, timestamp: Date.now() };
        try {
            action.id = await dbManager.addAction(action);
            state.history.push(action);
            state.redoStack = [];
            updateStatsDisplay();
        } catch (error) {
            console.error("Impossible d'ajouter l'action:", error);
        }
    }

    /** Gère le démarrage, la pause et la reprise du chronomètre. */
    function toggleTimer() {
        state.isRunning = !state.isRunning;
        if (state.isRunning) {
            state.timerInterval = setInterval(() => {
                state.elapsedTime++;
                ui.timer.textContent = formatTime(state.elapsedTime);
                updateStatsDisplay();
            }, 1000);
        } else {
            clearInterval(state.timerInterval);
        }
        updateTimerButton();
    }

    /** Annule la dernière action. */
    async function undo() {
        if (state.history.length === 0) return;
        const lastAction = state.history.pop();
        try {
            await dbManager.deleteAction(lastAction.id);
            state.redoStack.push(lastAction);
            updateStatsDisplay();
        } catch (error) {
            console.error("Impossible d'annuler l'action:", error);
            state.history.push(lastAction);
        }
    }

    /** Rétablit la dernière action annulée. */
    async function redo() {
        if (state.redoStack.length === 0) return;
        const actionToRedo = state.redoStack.pop();
        try {
            const { id, ...actionData } = actionToRedo;
            actionToRedo.id = await dbManager.addAction(actionData);
            state.history.push(actionToRedo);
            updateStatsDisplay();
        } catch (error) {
            console.error("Impossible de rétablir l'action:", error);
            state.redoStack.push(actionToRedo);
        }
    }

    /** Réinitialise toute la session. */
    async function resetApp() {
        if (!confirm(STRINGS.CONFIRM_RESET)) return;
        
        clearInterval(state.timerInterval);
        state = { ...state, history: [], redoStack: [], elapsedTime: 0, isRunning: false };
        
        ui.timer.textContent = formatTime(0);
        ui.playerName.value = '';
        ui.observerName.value = '';

        try {
            await dbManager.clearAllActions();
            updateStatsDisplay();
            updateTimerButton();
        } catch (error) {
            console.error("Impossible de vider la base de données:", error);
        }
    }

    /** Exporte les données au format CSV. */
    function exportCSV() {
        if (state.history.length === 0) {
            alert("Aucune action à exporter.");
            return;
        }
        const playerName = ui.playerName.value || 'N-A';
        const observerName = ui.observerName.value || 'N-A';
        
        const headers = `Joueur;${playerName}\r\nObservateur;${observerName}\r\nTimestamp;Date;Heure;Action;Points\r\n`;
        const rows = state.history.map(a => {
            const d = new Date(a.timestamp);
            return `${a.timestamp};${d.toLocaleDateString('fr-FR')};${d.toLocaleTimeString('fr-FR')};${a.type};${a.points}`;
        }).join('\r\n');

        const csvContent = headers + rows;
        const link = document.createElement("a");
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        link.download = `export_basket_${playerName}_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    }
    
    /** Affiche les stats sous forme de QR Code. */
    function showQRCode() {
        const stats = {
            joueur: ui.playerName.value || 'N/A',
            observateur: ui.observerName.value || 'N/A',
            points: ui.totalPoints.textContent,
            actions: ui.totalActions.textContent,
            apm: ui.apm.textContent
        };
        const statsString = Object.entries(stats).map(([key, value]) => `${key}: ${value}`).join('\n');
        
        ui.aiModal.style.display = 'flex';
        ui.modalBody.innerHTML = '';
        ui.modalBody.style.padding = '20px';

        new QRCode(ui.modalBody, {
            text: statsString,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    // --- FONCTIONNALITÉ GEMINI API ---
    
    function parseMarkdown(text) {
        let html = text
            .replace(/^\|(.+)\|\s*\n\|( *:?-+:? *\|)+/gm, (match, headerLine) => {
                const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
                return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
            })
            .replace(/^\|(.+)\|/gm, (match, rowLine) => {
                const cells = rowLine.split('|').map(c => c.trim()).filter(Boolean);
                if (cells.every(cell => cell.match(/^-+$/))) return '';
                return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
            })
            .replace(/(<\/tr>\s*)(?!<tr>|<tbody>)/g, '$1</tbody></table>')
            .replace(/^\s*###\s*(.*$)/gm, '<h3>$1</h3>')
            .replace(/^\*\s(.*$)/gm, '<ul><li>$1</li></ul>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/<\/ul>\s*<ul>/gm, '')
            .replace(/\n/g, '<br>');
        return html;
    }

    async function getAIAnalysis() {
        ui.aiModal.style.display = 'flex';
        ui.modalBody.innerHTML = '<div class="loader"></div>';

        const actionSummary = state.history.reduce((acc, action) => {
            acc[action.type] = (acc[action.type] || 0) + 1;
            return acc;
        }, {});
        
        const actionDetails = Object.entries(actionSummary)
            .map(([type, count]) => `${count}x ${type.replace(/_/g, ' ')}`)
            .join(', ');

        const duration = formatTime(state.elapsedTime);
        const totalPoints = ui.totalPoints.textContent;
        const totalActions = ui.totalActions.textContent;

        const prompt = `
Tu es un coach de basketball pour des lycéens (niveau Seconde), tu es technique, précis et motivant. Ton analyse doit s'appuyer sur les objectifs pédagogiques du basket 3x3 pour ce niveau, qui sont de "gagner avec la manière" en mettant en place un projet de jeu simple.

**Objectif clé à analyser :** Le jeu en largeur et le changement de "couloir" pour déséquilibrer la défense.

Utilise **uniquement** le format Markdown spécifié ci-dessous.

**Important: Chaque titre DOIT commencer par \`### \`. Ne crée aucun titre sans cela.**

La structure de ta réponse doit être exactement la suivante :

### Analyse du Coach (Lycée)
Un paragraphe d'introduction qui positionne l'analyse dans un cadre de progression tactique.

### Récapitulatif Statistique
Un tableau Markdown qui résume les "exploits individuels" et les actions clés. Le tableau DOIT suivre ce format exact :
| Statistique | Valeur |
| :--- | :--- |
| Paniers marqués | (insère le nombre ici) |
| Passes Réussies | (insère le nombre ici) |
| Interceptions | (insère le nombre ici) |
| Pertes de balle | (insère le nombre de passes perdues ici) |

### Analyse de ton Projet de Jeu
Analyse la performance en te concentrant sur ces points tactiques du niveau Lycée :
1.  **Utilisation de l'espace :** Le joueur a-t-il créé de la largeur ? A-t-il fait des passes qui changent de couloir (d'un côté à l'autre ou vers le centre) pour trouver des coéquipiers démarqués ? Analyse le ratio passes réussies / passes perdues sous cet angle.
2.  **Création d'incertitude :** Le joueur est-il une double menace (tir ET passe) ? A-t-il réussi à fixer un défenseur pour libérer un partenaire ?
3.  **Exploits individuels :** Évalue la capacité du joueur à être décisif (marquer, faire une passe décisive, intercepter).

### Piste de Progression
Propose un axe de travail tactique précis pour la prochaine séance, avec un exercice concret pour développer le point faible principal identifié (par exemple, un exercice sur le jeu de "passe et va" en changeant de couloir, ou sur la fixation-passe).

**Données brutes de la session à analyser :**
- Joueur : ${ui.playerName.value || 'Non spécifié'}
- Durée : ${duration}
- Actions totales : ${totalActions}
- Points totaux : ${totalPoints}
- Détail des actions : ${actionDetails}
        `.trim();
        
        try {
            const result = await callGeminiAPI(prompt);
            ui.modalBody.innerHTML = parseMarkdown(result);
        } catch (error) {
            ui.modalBody.innerText = "Désolé, une erreur est survenue lors de l'analyse. Veuillez réessayer plus tard.";
            console.error("Erreur Gemini API:", error);
        }
    }

    async function callGeminiAPI(prompt, retries = 3, delay = 1000) {
        const proxyUrl = 'proxy.php';
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Erreur du serveur proxy! Statut: ${response.status}`);

            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate?.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                throw new Error(result.error?.message || "Réponse invalide de l'API Gemini via le proxy.");
            }
        } catch (error) {
            if (retries > 0) {
                console.warn(`Tentative échouée, nouvelle tentative dans ${delay}ms... (${retries-1} restantes)`);
                await new Promise(res => setTimeout(res, delay));
                return callGeminiAPI(prompt, retries - 1, delay * 2);
            } else {
                throw error;
            }
        }
    }

    /** Initialise l'application. */
    async function initialize() {
        ui.startStopBtn.addEventListener('click', toggleTimer);
        ui.resetBtn.addEventListener('click', resetApp);
        ui.undoBtn.addEventListener('click', undo);
        ui.redoBtn.addEventListener('click', redo);
        ui.exportBtn.addEventListener('click', exportCSV);
        ui.qrCodeBtn.addEventListener('click', showQRCode);
        ui.analysisBtn.addEventListener('click', getAIAnalysis);
        ui.modalCloseBtn.addEventListener('click', () => ui.aiModal.style.display = 'none');
        ui.aiModal.addEventListener('click', (e) => {
            if (e.target === ui.aiModal) ui.aiModal.style.display = 'none';
        });

        ui.actionButtonsGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.action-btn');
            if (button) {
                const { action, points } = button.dataset;
                handleAction(action, parseInt(points));
            }
        });

        try {
            state.history = await dbManager.getAllActions();
            updateStatsDisplay();
            updateTimerButton();
        } catch (error) {
            console.error("Impossible de charger les données initiales:", error);
        }
    }

    initialize();
});

