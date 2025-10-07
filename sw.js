// sw.js - Service Worker pour la mise en cache et le fonctionnement hors ligne.

const CACHE_NAME = 'basketstat-cache-v1.3'; // Incrémenter pour forcer la mise à jour
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'db.js',
    'app.js',
    'sw-register.js',
    'manifest.json',
    'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
    'https://www.webjeje.com/online/webapp/bbpwa/icon-192.png',
    'https://www.webjeje.com/online/webapp/bbpwa/icon-512.png'
];

// Étape d'installation : mise en cache des ressources statiques.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Étape d'activation : nettoyage des anciens caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Étape de fetch : interception des requêtes réseau.
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Ne pas mettre en cache les requêtes vers le proxy de l'API Gemini.
    // Cela garantit que chaque analyse est une nouvelle requête.
    if (requestUrl.pathname.endsWith('/proxy.php')) {
        // Laisser la requête passer directement au réseau, sans utiliser le cache.
        return; 
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la ressource est dans le cache, la retourner.
                if (response) {
                    return response;
                }

                // Sinon, tenter de la récupérer sur le réseau.
                return fetch(event.request).then(
                    networkResponse => {
                        // Si la requête a réussi, la cloner et la mettre en cache pour une utilisation future.
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});

