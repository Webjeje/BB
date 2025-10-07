// db.js - Module pour la gestion de la base de données IndexedDB.

const DB_NAME = 'basketStatsDB';
const STORE_NAME = 'actions';
const DB_VERSION = 1;

const dbManager = {
    db: null,

    /**
     * Ouvre une connexion à la base de données IndexedDB.
     * @returns {Promise<IDBDatabase>} La connexion à la base de données.
     */
    async openDB() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                return resolve(this.db);
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("Erreur d'ouverture de la base de données:", event.target.error);
                reject("Erreur IndexedDB: " + event.target.errorCode);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },

    /**
     * Ajoute une action à la base de données.
     * @param {object} action - L'objet action à ajouter.
     * @returns {Promise<number>} L'ID de l'action ajoutée.
     */
    async addAction(action) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(action);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    /**
     * Supprime une action de la base de données par son ID.
     * @param {number} id - L'ID de l'action à supprimer.
     * @returns {Promise<void>}
     */
    async deleteAction(id) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    },

    /**
     * Récupère toutes les actions de la base de données.
     * @returns {Promise<Array<object>>} Un tableau de toutes les actions.
     */
    async getAllActions() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    /**
     * Vide complètement la base de données des actions.
     * @returns {Promise<void>}
     */
    async clearAllActions() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    },
};

