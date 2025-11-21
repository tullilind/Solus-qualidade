const CACHE_NAME = 'bioteste-solus-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './verificar.token.html',
    './boas.vindas.html',
    './painel.solus.bioteste.html',
    './adicionar.atendimento.html',
    './lista.atendimentos.html',
    './relatorios.html',
    './video.aula.html',
    './minha.conta.html',
    './admqualidade/boasvindasadm.html',
    './admqualidade/painel.qualidade.html',
    './admqualidade/pesquisa.qualidade.html',
    './admqualidade/relatorio.pesquisa.html',
    './admqualidade/relatorios.gerais.html',
    './admqualidade/gerenciar.usuarios.html',
    './admqualidade/manual.html',
    './admqualidade/minha.conta.html',
    './layout.js',
    './layout.adm.js',
    './art.secure.js',
    './logo.png',
    './videoaula.mp3'
];

// 1. Instalação: Cache inicial dos arquivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 3. Interceptação de Requisições (Fetch)
self.addEventListener('fetch', (event) => {
    // Ignora requisições para a API do Google (deixa o app lidar com elas ou a fila offline)
    if (event.request.url.includes('script.google.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retorna do cache se existir, senão vai para a rede
            return response || fetch(event.request).then((networkResponse) => {
                // Opcional: Cache dinâmico de novos arquivos visitados
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});