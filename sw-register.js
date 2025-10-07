// sw-register.js - Enregistre le Service Worker pour la PWA.

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker enregistré avec succès. Scope:', registration.scope);
            })
            .catch(error => {
                console.error('Échec de l\'enregistrement du ServiceWorker:', error);
            });
    });
}

