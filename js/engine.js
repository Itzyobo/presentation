/* ==========================================================================
   engine.js — window.App
   State, registre d ecrans, navigation, score, badges, persistance
   localStorage, transitions, helpers (el, icon).
   Script CLASSIQUE (pas de module) : expose window.App.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var App = {};

  /* -------------------------------------------------- Config & state */
  App.config = { key: "etap-santé-parcours", total: 0 };

  App.state = {
    index: 0,
    score: 0,
    maxScore: 0,
    badges: [],     // [{id, label}]
    answers: {},    // { screenId: {correct, points, value, resolved:true} }
    visited: []     // [screenId, ...]
  };

  App.screens = [];                 // definitions ordonnees
  App.mechanics = App.mechanics || {}; // peuple par mechanics.js + overrides
  App.reducedMotion = false;

  /* refs du shell (remplies à l init) */
  var R = {};
  var transitioning = false;

  /* ====================================================================
     HELPERS DOM
     ==================================================================== */

  /**
   * Mini-builder DOM.
   * props : { class, html, text, attrs:{}, dataset:{}, on:{event:fn}, style:{} }
   * children : noeud | string | tableau (melange autorise, null ignore)
   */
  App.el = function (tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};

    if (props.class) node.className = props.class;
    if (props.id) node.id = props.id;
    if (typeof props.html === "string") node.innerHTML = props.html;
    else if (typeof props.text === "string") node.textContent = props.text;

    if (props.attrs) {
      for (var a in props.attrs) {
        if (props.attrs[a] != null) node.setAttribute(a, props.attrs[a]);
      }
    }
    if (props.dataset) {
      for (var d in props.dataset) node.dataset[d] = props.dataset[d];
    }
    if (props.style) {
      for (var s in props.style) node.style.setProperty(s, props.style[s]);
    }
    if (props.on) {
      for (var ev in props.on) node.addEventListener(ev, props.on[ev]);
    }

    appendChildren(node, children);
    return node;
  };

  function appendChildren(node, children) {
    if (children == null) return;
    if (Array.isArray(children)) {
      children.forEach(function (c) { appendChildren(node, c); });
      return;
    }
    if (typeof children === "string" || typeof children === "number") {
      node.appendChild(document.createTextNode(String(children)));
      return;
    }
    if (children.nodeType) node.appendChild(children);
  }

  /* ====================================================================
     ICONES — SVG inline, trait fin ~1.6, petit set
     ==================================================================== */
  var ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    alert: '<path d="M12 9v4.5M12 16.5h.01"/><path d="M10.3 4.2 2.9 17.4a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    leaf: '<path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 14Z"/><path d="M4 20c4-6 8-9 12-10"/>',
    shield: '<path d="M12 3.5l7 2.5v5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-2.5Z"/><path d="M9 12l2 2 4-4.2"/>',
    bulb: '<path d="M9.2 17.5h5.6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.5l.1.7h5.2l.1-.7c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3Z"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>',
    hand: '<path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-7 7-3 0-4.4-1.2-6.2-4.2l-1.4-2.5a1.6 1.6 0 0 1 2.7-1.7L8 13"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17 14.6a5.5 5.5 0 0 1 3.5 4.9"/>',
    sparkle: '<path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7L12 3.5Z"/><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"/>',
    dot: '<circle cx="12" cy="12" r="3.2"/>',
    flip: '<path d="M4 8a8 8 0 0 1 14-3M20 16a8 8 0 0 1-14 3"/><path d="M18 3v3h-3M6 21v-3h3"/>',
    star: '<path d="M12 3.6l2.5 5.4 5.9.6-4.4 4 1.2 5.8L12 16.9 6.8 19.4 8 13.6l-4.4-4 5.9-.6L12 3.6Z"/>',
    refresh: '<path d="M4 11a8 8 0 0 1 14-4.5M20 13a8 8 0 0 1-14 4.5"/><path d="M18 3v4h-4M6 21v-4h4"/>'
  };

  App.icon = function (name) {
    var body = ICONS[name] || ICONS.dot;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + body + '</svg>';
  };

  /* ====================================================================
     REGISTRE
     ==================================================================== */
  App.registerScreen = function (def) {
    App.screens.push(def);
    App.config.total = App.screens.length;
    return App;
  };

  App.registerScreens = function (arr) {
    (arr || []).forEach(function (d) { App.registerScreen(d); });
    return App;
  };

  /* ====================================================================
     PERSISTANCE
     ==================================================================== */
  App.save = function () {
    try {
      var snap = {
        index: App.state.index,
        score: App.state.score,
        badges: App.state.badges,
        answers: App.state.answers,
        visited: App.state.visited
      };
      localStorage.setItem(App.config.key, JSON.stringify(snap));
    } catch (e) { /* file:// ou stockage indisponible : on ignore */ }
  };

  App.load = function () {
    try {
      var raw = localStorage.getItem(App.config.key);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return false;
      App.state.index = clamp(data.index || 0, 0, Math.max(0, App.config.total - 1));
      App.state.score = data.score || 0;
      App.state.badges = Array.isArray(data.badges) ? data.badges : [];
      App.state.answers = data.answers && typeof data.answers === "object" ? data.answers : {};
      App.state.visited = Array.isArray(data.visited) ? data.visited : [];
      return true;
    } catch (e) { return false; }
  };

  /* ====================================================================
     SCORE & BADGES
     ==================================================================== */
  App.addScore = function (points, screenId) {
    points = points || 0;
    if (!points) return;
    var rec = App.state.answers[screenId];
    if (rec && rec.scored) return; // idempotent : déjà credite
    App.state.score += points;
    if (!rec) rec = App.state.answers[screenId] = {};
    rec.scored = true;
    rec.points = points;
    renderScore(true);
    App.save();
  };

  App.awardBadge = function (badge) {
    if (!badge || !badge.id) return;
    var exists = App.state.badges.some(function (b) { return b.id === badge.id; });
    if (exists) return; // idempotent
    App.state.badges.push({ id: badge.id, label: badge.label || badge.id });
    renderBadges();
    toastBadge(badge);
    App.save();
  };

  /* ====================================================================
     REPONSES
     ==================================================================== */
  App.recordAnswer = function (screenId, value) {
    var rec = App.state.answers[screenId] || (App.state.answers[screenId] = {});
    rec.resolved = true;
    if (value !== undefined) rec.value = value;
    if (App.state.visited.indexOf(screenId) === -1) App.state.visited.push(screenId);
    App.save();
  };

  App.isAnswered = function (screenId) {
    var rec = App.state.answers[screenId];
    return !!(rec && rec.resolved);
  };

  App.getAnswer = function (screenId) {
    return App.state.answers[screenId] || null;
  };

  /* ====================================================================
     INIT
     ==================================================================== */
  App.init = function () {
    App.reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // refs shell
    R.stage = document.getElementById("stage");
    R.progressLabel = document.getElementById("progressLabel");
    R.progressPct = document.getElementById("progressPct");
    R.progressFill = document.getElementById("progressFill");
    R.score = document.getElementById("score");
    R.scoreValue = document.getElementById("scoreValue");
    R.scoreMax = document.getElementById("scoreMax");
    R.badgesBtn = document.getElementById("badgesBtn");
    R.badgesCount = document.getElementById("badgesCount");
    R.badgesDrawer = document.getElementById("badgesDrawer");
    R.badgesList = document.getElementById("badgesList");
    R.thread = document.getElementById("threadText");
    R.prevBtn = document.getElementById("prevBtn");
    R.nextBtn = document.getElementById("nextBtn");
    R.resetBtn = document.getElementById("resetBtn");
    R.toasts = document.getElementById("toasts");

    // maxScore = somme des points de toutes les definitions
    App.state.maxScore = App.screens.reduce(function (s, d) {
      return s + (d.points || 0);
    }, 0);

    App.load();
    renderScoreMax();
    renderScore(false);
    renderBadges();

    // controles globaux
    if (R.prevBtn) R.prevBtn.addEventListener("click", function () { App.prev(); });
    if (R.nextBtn) R.nextBtn.addEventListener("click", function () { App.next(); });
    if (R.resetBtn) R.resetBtn.addEventListener("click", function () { App.reset(); });
    if (R.badgesBtn) R.badgesBtn.addEventListener("click", toggleDrawer);
    document.addEventListener("click", function (e) {
      if (R.badgesDrawer && R.badgesDrawer.classList.contains("open")) {
        if (!R.badgesDrawer.contains(e.target) && !R.badgesBtn.contains(e.target)) {
          closeDrawer();
        }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    render(App.state.index, null);
  };

  /* ====================================================================
     NAVIGATION
     ==================================================================== */
  App.goto = function (index, opts) {
    opts = opts || {};
    if (transitioning) return;
    var target = clamp(index, 0, App.config.total - 1);
    if (target === App.state.index && R.stage.firstChild) return;
    var dir = opts.direction || (target > App.state.index ? "next" : "prev");
    App.state.index = target;
    App.save();
    render(target, dir);
  };

  App.next = function () { App.goto(App.state.index + 1, { direction: "next" }); };
  App.prev = function () { App.goto(App.state.index - 1, { direction: "prev" }); };

  App.reset = function () {
    var ok = window.confirm(
      "Recommencer le parcours ? Ton score et tes badges seront remis à zéro."
    );
    if (!ok) return;
    App.state.index = 0;
    App.state.score = 0;
    App.state.badges = [];
    App.state.answers = {};
    App.state.visited = [];
    try { localStorage.removeItem(App.config.key); } catch (e) { }
    renderScore(false);
    renderBadges();
    closeDrawer();
    render(0, null);
  };

  /* ====================================================================
     RENDU D UN ECRAN
     ==================================================================== */
  function render(index, dir) {
    var def = App.screens[index];
    if (!def) return;

    var build = function () {
      R.stage.innerHTML = "";
      var screenEl = buildScreen(def, dir);
      R.stage.appendChild(screenEl);
      updateHeader(def);
      updateFooter(def);
      // focus le titre pour l accessibilite
      var title = screenEl.querySelector(".screen__title");
      if (title) {
        title.setAttribute("tabindex", "-1");
        // leger delai pour ne pas couper l animation d entree
        window.setTimeout(function () { try { title.focus({ preventScroll: false }); } catch (e) { title.focus(); } }, App.reducedMotion ? 0 : 90);
      }
    };

    // transition de sortie de l ancien ecran
    var current = R.stage.firstChild;
    if (current && dir && !App.reducedMotion) {
      transitioning = true;
      current.classList.add(dir === "next" ? "is-leaving-next" : "is-leaving-prev");
      window.setTimeout(function () {
        transitioning = false;
        build();
      }, 200);
    } else {
      build();
    }
  }

  function buildScreen(def, dir) {
    var ctx = makeContext(def);

    // chip eyebrow
    var chip = App.el("span", { class: "eyebrow" }, [
      App.el("span", { class: "eyebrow__dot", html: App.icon("dot") }),
      def.eyebrow || ""
    ]);

    var head = App.el("header", { class: "screen__head" }, [
      chip,
      App.el("h2", {
        class: "screen__title",
        attrs: { "aria-label": (def.title || "") + " — étape " + (def.num || (App.state.index + 1)) }
      }, [
        def.title || "",
        App.el("span", { class: "screen__num", text: pad(def.num || (App.state.index + 1)) })
      ])
    ]);

    var body = App.el("div", { class: "screen__body" });

    var foot = App.el("footer", { class: "screen__foot" }, [
      App.el("div", { class: "feedback", attrs: { "aria-live": "polite", rôle: "status" } }),
      App.el("div", { class: "foot-cta" })
    ]);

    var screenEl = App.el("section", {
      class: "screen" + (dir ? " is-entering-" + dir : ""),
      attrs: { "data-theme": def.theme || "intro", "data-kind": def.kind, rôle: "group" },
      dataset: { id: def.id }
    }, [head, body, foot]);

    // exposer les refs au contexte
    ctx.screenEl = screenEl;
    ctx._feedback = foot.querySelector(".feedback");
    ctx._footCta = foot.querySelector(".foot-cta");

    // deleguer le corps à la mécanique
    var mech = App.mechanics[def.kind];
    var content;
    if (typeof mech === "function") {
      try {
        content = mech(def, ctx);
      } catch (err) {
        content = App.el("p", { class: "lead", text: "Cette étape n'a pas pu s'afficher." });
        if (window.console) console.error("Mécanique '" + def.kind + "' :", err);
      }
    } else {
      content = App.el("p", { class: "lead", text: "Mécanique inconnue : " + def.kind });
    }
    if (content) body.appendChild(content);

    return screenEl;
  }

  /* ====================================================================
     CONTEXTE fourni a chaque mécanique
     ==================================================================== */
  function makeContext(def) {
    var ctx = {
      def: def,
      screenEl: null,
      root: null,
      _feedback: null,
      _footCta: null
    };

    ctx.setFeedback = function (html, tone) {
      if (!ctx._feedback) return;
      ctx._feedback.className = "feedback show" + (tone ? " is-" + tone : "");
      ctx._feedback.innerHTML = "";
      var iconName = tone === "ok" ? "check"
        : tone === "alert" ? "alert"
          : tone === "warn" ? "alert"
            : "info";
      var card = App.el("div", { class: "feedback__card" }, [
        App.el("span", { class: "feedback__icon", html: App.icon(iconName) }),
        App.el("div", { class: "feedback__text", html: html || "" })
      ]);
      ctx._feedback.appendChild(card);
    };

    ctx.enableContinue = function (label, onClick) {
      if (!ctx._footCta) return;
      ctx._footCta.innerHTML = "";
      var btn = makeContinueButton(label || "Continuer", onClick || function () { App.next(); });
      ctx._footCta.appendChild(btn);
      // petite revelation
      if (!App.reducedMotion) {
        btn.style.opacity = "0";
        btn.style.transform = "translateY(8px)";
        requestAnimationFrame(function () {
          btn.style.transition = "opacity .34s var(--ease-out), transform .34s var(--ease-out)";
          btn.style.opacity = "1";
          btn.style.transform = "translateY(0)";
        });
      }
      return btn;
    };

    /**
     * resolve({correct, points, badge, feedbackHTML, retain, tone})
     * Enregistre la reponse, score si correct (idempotent), badge si fourni,
     * affiche feedback + bouton Continuer.
     */
    ctx.resolve = function (result) {
      result = result || {};
      var already = App.isAnswered(def.id);

      App.recordAnswer(def.id, result.value);

      if (result.correct && result.points) {
        App.addScore(result.points, def.id); // idempotent
      }
      if (result.correct && result.badge && !already) {
        App.awardBadge(result.badge);
      } else if (result.correct && result.badge && already) {
        // revisite : on garde le badge déjà attribue, pas de toast
        App.awardBadge(result.badge); // awardBadge est idempotent (pas de toast si present)
      }

      var tone = result.tone || (result.correct ? "ok" : (result.soft ? "warn" : "alert"));
      var html = result.feedbackHTML || "";
      if (result.retain) {
        html += '<p class="retain"><span class="retain__tag">A retenir</span>' +
          escapeHtml(result.retain) + '</p>';
      }
      ctx.setFeedback(html, tone);
      ctx.enableContinue(result.continueLabel || "Continuer", function () { App.next(); });
    };

    return ctx;
  }

  /* ====================================================================
     BOUTON « CONTINUER » (pilule + icone-cercle)
     ==================================================================== */
  function makeContinueButton(label, onClick) {
    return App.el("button", {
      class: "btn btn--primary",
      attrs: { type: "button" },
      on: { click: onClick }
    }, [
      App.el("span", { class: "btn__label", text: label }),
      App.el("span", { class: "btn__icon", html: App.icon("arrow") })
    ]);
  }
  App.makeContinueButton = makeContinueButton;

  /* ====================================================================
     RENDU DU SHELL (header / footer)
     ==================================================================== */
  function updateHeader(def) {
    var n = App.state.index + 1;
    var total = App.config.total;
    if (R.progressLabel) {
      R.progressLabel.innerHTML = "Étape <b>" + n + "</b> / " + total;
    }
    var pct = total > 1 ? Math.round(((n) / total) * 100) : 100;
    if (R.progressPct) R.progressPct.textContent = pct + "%";
    if (R.progressFill) R.progressFill.style.transform = "scaleX(" + (pct / 100) + ")";
    // propager le theme courant à l app pour teinter la barre + accents header
    document.documentElement.setAttribute("data-screen-theme", def.theme || "intro");
    if (R.progressFill && R.progressFill.parentElement) {
      R.progressFill.closest(".app") && R.progressFill.closest(".app").setAttribute("data-theme", def.theme || "intro");
    }
  }

  function updateFooter(def) {
    // navigation
    if (R.prevBtn) R.prevBtn.disabled = App.state.index === 0;
    if (R.nextBtn) R.nextBtn.disabled = App.state.index >= App.config.total - 1;
    // fil rouge
    if (R.thread) {
      var line = THREAD[App.state.index % THREAD.length];
      R.thread.textContent = line;
    }
  }

  function renderScoreMax() {
    if (R.scoreMax) R.scoreMax.textContent = App.state.maxScore;
  }

  function renderScore(bump) {
    if (R.scoreValue) R.scoreValue.textContent = App.state.score;
    if (bump && R.score && !App.reducedMotion) {
      R.score.classList.remove("bump");
      // force reflow pour rejouer l animation
      void R.score.offsetWidth;
      R.score.classList.add("bump");
      window.setTimeout(function () { R.score && R.score.classList.remove("bump"); }, 320);
    }
  }

  function renderBadges() {
    if (R.badgesCount) R.badgesCount.textContent = App.state.badges.length;
    if (!R.badgesList) return;
    R.badgesList.innerHTML = "";
    if (!App.state.badges.length) {
      R.badgesList.appendChild(App.el("p", {
        class: "badges__empty",
        text: "Aucun badge pour l'instant. Réponds juste pour en débloquer."
      }));
      return;
    }
    App.state.badges.forEach(function (b, i) {
      var pill = App.el("div", {
        class: "badge-pill",
        style: { "animation-delay": (i * 50) + "ms" }
      }, [
        App.el("span", { class: "icon-wrap", html: App.icon("leaf") }),
        App.el("span", { text: b.label })
      ]);
      R.badgesList.appendChild(pill);
    });
  }

  /* ====================================================================
     TIROIR DE BADGES
     ==================================================================== */
  function toggleDrawer() {
    if (!R.badgesDrawer) return;
    var open = R.badgesDrawer.classList.toggle("open");
    R.badgesBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeDrawer() {
    if (!R.badgesDrawer) return;
    R.badgesDrawer.classList.remove("open");
    if (R.badgesBtn) R.badgesBtn.setAttribute("aria-expanded", "false");
  }

  /* ====================================================================
     TOAST « badge débloqué »
     ==================================================================== */
  function toastBadge(badge) {
    if (!R.toasts) return;
    var toast = App.el("div", { class: "toast", attrs: { rôle: "status" } }, [
      App.el("span", { class: "toast__icon", html: App.icon("sparkle") }),
      App.el("div", { class: "toast__body" }, [
        App.el("span", { class: "toast__kicker", text: "Badge débloqué" }),
        App.el("strong", { class: "toast__label", text: badge.label || badge.id })
      ])
    ]);
    R.toasts.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("show"); });
    window.setTimeout(function () {
      toast.classList.remove("show");
      toast.classList.add("hide");
      window.setTimeout(function () { toast.remove(); }, 320);
    }, 2600);
  }

  /* ====================================================================
     FIL ROUGE (phrases courtes du footer)
     ==================================================================== */
  var THREAD = [
    "Tu n'as pas à deviner.",
    "Un doute se clarifie.",
    "Parler tôt évite que la situation s'installe.",
    "Un poste mal adapté fatigue plus vite.",
    "Un passage dégagé évite beaucoup d'accidents.",
    "Signaler tôt, c'est déjà prévenir.",
    "Demander de l'aide est un réflexe professionnel."
  ];
  App.THREAD = THREAD;

  /* ====================================================================
     UTILITAIRES
     ==================================================================== */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  App.clamp = clamp;

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  App.pad = pad;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  App.escapeHtml = escapeHtml;

  /* ====================================================================
     Mise à jour du tier final (helper partage pour la mécanique final)
     ==================================================================== */
  App.tierFor = function (tiers, score) {
    if (!Array.isArray(tiers)) return null;
    for (var i = 0; i < tiers.length; i++) {
      var t = tiers[i];
      if (score >= t.min && score <= t.max) return t;
    }
    return tiers[tiers.length - 1] || null;
  };

  window.App = App;
})(window, document);
