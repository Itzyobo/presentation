/* ==========================================================================
   illustrations.js — window.App.art
   SVG inline, style ligne, couleurs de marque. Placeholders propres en
   phase 1 ; enrichis en phase 2.
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});
  var art = {};

  /* --------------------------------------------------------------------
     heroSVG — illustration d accueil : silhouette bien-être + feuille,
     style ligne, dans une coque teal/bleu arrondie. Pas d emoji.
     -------------------------------------------------------------------- */
  art.heroSVG = function () {
    return [
      '<svg class="hero-art" viewBox="0 0 420 360" fill="none" rôle="img"',
      ' aria-label="Personne en mouvement et feuille, prévention santé au travail"',
      ' xmlns="http://www.w3.org/2000/svg">',
      '  <defs>',
      '    <linearGradient id="haloA" x1="0" y1="0" x2="1" y2="1">',
      '      <stop offset="0" stop-color="#E3F1ED"/>',
      '      <stop offset="1" stop-color="#E6EFF6"/>',
      '    </linearGradient>',
      '    <linearGradient id="leafA" x1="0" y1="0" x2="1" y2="1">',
      '      <stop offset="0" stop-color="#6FC585"/>',
      '      <stop offset="1" stop-color="#57B36F"/>',
      '    </linearGradient>',
      '  </defs>',
      // halo doux
      '  <circle cx="210" cy="178" r="150" fill="url(#haloA)"/>',
      '  <circle cx="210" cy="178" r="150" fill="none" stroke="#0F8676" stroke-opacity="0.10"/>',
      // arcs de mouvement
      '  <path d="M70 230 A150 150 0 0 1 130 96" stroke="#2E6FA0" stroke-opacity="0.35" stroke-width="2.4" stroke-linecap="round"/>',
      '  <path d="M350 126 A150 150 0 0 1 300 262" stroke="#0F8676" stroke-opacity="0.40" stroke-width="2.4" stroke-linecap="round"/>',
      // silhouette en mouvement (course / dynamisme)
      '  <g stroke="#14313A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none">',
      '    <circle cx="208" cy="96" r="20" fill="#FFFFFF"/>',
      '    <path d="M208 118 C200 140 196 156 200 176"/>',           // torse
      '    <path d="M200 176 L176 214 L168 250"/>',                   // jambe arriere
      '    <path d="M200 168 L232 196 L246 236"/>',                   // jambe avant
      '    <path d="M203 132 L168 150 L150 138"/>',                   // bras arriere
      '    <path d="M205 130 L242 132 L262 152"/>',                   // bras avant
      '  </g>',
      // feuille (santé / vert)
      '  <g transform="translate(268 196) rotate(18)">',
      '    <path d="M0 34 C0 12 18 -2 44 0 C44 26 26 42 0 34 Z" fill="url(#leafA)"/>',
      '    <path d="M6 30 C18 22 30 14 40 6" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2.2" stroke-linecap="round"/>',
      '  </g>',
      // petites pastilles d accent (rythme)
      '  <circle cx="118" cy="270" r="7" fill="#57B36F"/>',
      '  <circle cx="320" cy="92" r="6" fill="#2E6FA0"/>',
      '  <circle cx="96" cy="120" r="5" fill="#0F8676"/>',
      '</svg>'
    ].join("");
  };

  /* --------------------------------------------------------------------
     bgSVG — fond decoratif leger : lignes/arcs très discrets pour l app-bg.
     -------------------------------------------------------------------- */
  art.bgSVG = function () {
    return [
      '<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none"',
      ' xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
      '  <g stroke="#0F8676" stroke-opacity="0.06" stroke-width="1.4" fill="none">',
      '    <path d="M-40 140 C 240 60 460 220 760 140 S 1180 60 1320 180"/>',
      '    <path d="M-40 380 C 260 300 520 460 820 380 S 1180 300 1320 420"/>',
      '    <path d="M-40 620 C 240 540 500 700 800 620 S 1180 540 1320 660"/>',
      '  </g>',
      '  <g fill="#2E6FA0" fill-opacity="0.05">',
      '    <circle cx="180" cy="120" r="4"/><circle cx="980" cy="240" r="4"/>',
      '    <circle cx="520" cy="660" r="4"/><circle cx="1080" cy="600" r="4"/>',
      '  </g>',
      '</svg>'
    ].join("");
  };

  /* --------------------------------------------------------------------
     badgeIcon — petit glyphe pour une ressource/badge.
     Reutilise le set d icones du moteur. Placeholder coherent.
     -------------------------------------------------------------------- */
  art.badgeIcon = function (name) {
    return App.icon ? App.icon(name || "leaf") : "";
  };

  /* --------------------------------------------------------------------
     resourceGlyph — vignette pour une carte de ressource (icone dans un
     cercle teinte). Placeholder propre, surcharge possible en phase 2.
     -------------------------------------------------------------------- */
  art.resourceGlyph = function (name) {
    return [
      '<span class="res-glyph" aria-hidden="true">',
      App.icon ? App.icon(name || "users") : "",
      '</span>'
    ].join("");
  };

  /* --------------------------------------------------------------------
     sceneSVG — placeholder de « scene » generique pour workstation / hidden.
     Phase 2 : vraie scene SVG cliquable. Ici : cadre + sol stylise.
     -------------------------------------------------------------------- */
  art.sceneSVG = function () {
    return [
      '<svg class="scene-art" viewBox="0 0 320 180" fill="none" aria-hidden="true"',
      ' xmlns="http://www.w3.org/2000/svg">',
      '  <rect x="2" y="2" width="316" height="176" rx="18" fill="#F8FBFA" stroke="#14313A" stroke-opacity="0.08"/>',
      '  <path d="M20 132 H300" stroke="#14313A" stroke-opacity="0.12" stroke-width="2" stroke-linecap="round"/>',
      '  <rect x="40" y="60" width="84" height="56" rx="8" fill="#E3F1ED" stroke="#0F8676" stroke-opacity="0.25"/>',
      '  <rect x="150" y="78" width="60" height="38" rx="6" fill="#E6EFF6" stroke="#2E6FA0" stroke-opacity="0.25"/>',
      '  <circle cx="250" cy="96" r="22" fill="#E7F4EA" stroke="#57B36F" stroke-opacity="0.35"/>',
      '</svg>'
    ].join("");
  };

  /* --------------------------------------------------------------------
     finalSVG — petit visuel de bilan (cible + feuille) pour l'écran final.
     -------------------------------------------------------------------- */
  art.finalSVG = function () {
    return [
      '<svg class="final-art" viewBox="0 0 200 160" fill="none" rôle="img"',
      ' aria-label="Bilan du parcours" xmlns="http://www.w3.org/2000/svg">',
      '  <circle cx="100" cy="80" r="60" fill="#E3F1ED"/>',
      '  <circle cx="100" cy="80" r="60" fill="none" stroke="#0F8676" stroke-opacity="0.18"/>',
      '  <circle cx="100" cy="80" r="40" fill="none" stroke="#0F8676" stroke-opacity="0.35" stroke-width="2"/>',
      '  <circle cx="100" cy="80" r="20" fill="#FFFFFF" stroke="#0A6E61" stroke-width="2.2"/>',
      '  <path d="M91 80 l6 6 12 -13" stroke="#0A6E61" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
      '  <g transform="translate(132 30) rotate(20)">',
      '    <path d="M0 22 C0 6 12 -2 28 0 C28 18 16 28 0 22 Z" fill="#57B36F"/>',
      '  </g>',
      '</svg>'
    ].join("");
  };

  /* ====================================================================
     ILLUSTRATIONS DU LIVRET SECURITE (style ligne, palette de marque)
     Reference par data.illustration_id dans content-securite.js.
     ==================================================================== */

  /* triangle du feu — 3 sommets + flamme (zone cible e4) */
  art.triangle_feu = function () {
    return '<img src="assets/feu.png" alt="Triangle du feu" style="width: 100%; height: auto; border-radius: 14px; display: block;">';
  };

  /* schema de parking vu de dessus — emplacements A B C D (e5) */
  art.parking_schema = function () {
    return '<img src="assets/ParkingABCD.png" alt="Schéma d\'un parking vu de dessus" style="width: 100%; height: auto; border-radius: 14px; display: block;">';
  };

  /* couloir + escalier avec obstacles (e7) */
  art.couloir_risques = function () {
    return '<img src="assets/Escaliers_et_chutes.png" alt="Couloir menant à un escalier, avec obstacles" style="width: 100%; height: auto; border-radius: 14px; display: block;">';
  };

  /* trois bureaux A B C (e9) */
  art.bureau_abc = function () {
    return '<img src="assets/BureauABC.png" alt="Trois postes de travail A, B et C" style="width: 100%; height: auto; border-radius: 14px; display: block;">';
  };

  App.art = art;
})(window);
