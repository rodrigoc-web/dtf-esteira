// Deixa a Esteira "instalável" no tablet e abre a tela mesmo com a rede
// oscilando. Sempre tenta a versão nova primeiro (atualização chega sozinha);
// a cópia guardada só entra se a rede falhar. As chamadas ao Supabase nunca
// passam por aqui (são de outro endereço).
const CACHE = "esteira-v1";
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copia = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request))
  );
});
