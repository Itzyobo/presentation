/* ==========================================================================
   sw.js — Service worker Etap-Sante
   - Precharge le shell de l app a l installation (tolerant : un asset
     manquant ne casse pas l installation).
   - Navigations : network-first avec repli sur index.html (mode hors-ligne).
   - Assets meme-origine : stale-while-revalidate (rapide + mise a jour en fond).
   - Polices Google : cache-first « best effort ».
   Pour publier une mise a jour, incremente VERSION.
   ========================================================================== */
"use strict";

var VERSION = "etap-sante-v2";
var CACHE = VERSION;

/* Shell de l application (chemins relatifs au scope du worker). */
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/components.css",
  "./css/screens.css",
  "./css/screen-workstation.css",
  "./css/screen-hidden.css",
  "./css/mechanics-new.css",
  "./css/screen-securite.css",
  "./js/engine.js",
  "./js/illustrations.js",
  "./js/mechanics.js",
  "./js/content.js",
  "./js/screen-workstation.js",
  "./js/screen-hidden.js",
  "./js/screen-dragdrop.js",
  "./js/screen-association.js",
  "./js/mechanics-securite.js",
  "./js/content-securite.js",
  "./js/main.js",
  "./assets/logo.png",
  "./assets/favicon.svg"
  // Photos des personnes ressources (e13/e14) : non fournies dans /assets ;
  // le code utilise un fallback onerror. Ajoute-les ici si elles arrivent.
];

/* -------------------------------------------------- Install : precache */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // add() individuel : un 404 isole n empeche pas l installation.
      return Promise.all(
        PRECACHE.map(function (url) {
          return cache.add(url).catch(function () { /* ignore */ });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* -------------------------------------------------- Activate : nettoyage */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* -------------------------------------------------- Helpers */
function fromCache(request) {
  return caches.match(request);
}

function putInCache(request, response) {
  // Ne met en cache que des reponses exploitables et meme-origine.
  if (!response || response.status !== 200 || response.type === "error") {
    return response;
  }
  var copy = response.clone();
  caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
  return response;
}

/* -------------------------------------------------- Fetch */
self.addEventListener("fetch", function (event) {
  var req = event.request;

  // On ne gere que les GET.
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // 1) Navigations -> network-first, repli index.html hors-ligne.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(function (res) { return putInCache(req, res); })
        .catch(function () {
          return fromCache(req).then(function (hit) {
            return hit || caches.match("./index.html");
          });
        })
    );
    return;
  }

  // 2) Assets meme-origine -> stale-while-revalidate.
  if (sameOrigin) {
    event.respondWith(
      fromCache(req).then(function (hit) {
        var network = fetch(req)
          .then(function (res) { return putInCache(req, res); })
          .catch(function () { return hit; });
        return hit || network;
      })
    );
    return;
  }

  // 3) Cross-origin (polices Google, etc.) -> cache-first best effort.
  event.respondWith(
    fromCache(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        return putInCache(req, res);
      }).catch(function () { return hit; });
    })
  );
});
