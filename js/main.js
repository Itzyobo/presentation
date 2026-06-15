/* ==========================================================================
   main.js — point d entree.
   Charge en dernier. Injecte le fond decoratif, demarre l app et enregistre
   le service worker de manière tolerante.
   ========================================================================== */
(function (window, document) {
  "use strict";

  function boot() {
    var App = window.App;
    if (!App) return;

    // fond decoratif (SVG leger)
    var bg = document.getElementById("appBg");
    if (bg && App.art && App.art.bgSVG) {
      bg.innerHTML = App.art.bgSVG();
    }

    // démarrage du moteur
    App.init();

    // service worker : optionnel et tolerant (ignore en file://)
    if ("serviceWorker" in navigator && window.location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () { /* silencieux */ });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);
