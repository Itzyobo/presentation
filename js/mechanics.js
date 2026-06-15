/* ==========================================================================
   mechanics.js — window.App.mechanics
   Une fabrique par type de mécanique. Chaque fabrique reçoit (def, ctx)
   et renvoie l élément du corps (.screen__body content), en cablant les
   interactions et en appelant ctx.resolve(...) quand l étape est terminee.

   Toutes les mécaniques respectent l idempotence : si l'écran a déjà ete
   répondu (App.isAnswered), elles re-affichent l état resolu SANS re-scorer.

   workstation et hidden sont fournies ici en VERSION GENERIQUE complete ;
   elles seront surchargees en phase 2 par screen-workstation.js / screen-hidden.js.
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});
  var M = App.mechanics || (App.mechanics = {});
  var el = App.el;

  /* ====================================================================
     Helpers communs aux mécaniques
     ==================================================================== */

  function staggerWrap(children) {
    var box = el("div", { class: "stagger" });
    (children || []).forEach(function (c, i) {
      if (!c) return;
      if (c.style) c.style.setProperty("--i", i);
      box.appendChild(c);
    });
    return box;
  }

  function situationBlock(text) {
    if (!text) return null;
    return el("div", { class: "situation" }, [
      el("p", { class: "situation__text", text: text })
    ]);
  }

  function questionBlock(text) {
    if (!text) return null;
    return el("p", { class: "question", text: text });
  }

  // marque un bouton choisi (état visuel) parmi un groupe
  function setChoiceState(node, state) {
    node.classList.remove("is-correct", "is-wrong", "is-selected", "is-muted");
    if (state) node.classList.add("is-" + state);
  }

  // verrouille tous les boutons d'un groupe
  function lockGroup(nodes) {
    nodes.forEach(function (n) { n.disabled = true; n.classList.add("locked"); });
  }

  /* ====================================================================
     INTRO
     ==================================================================== */
  M.intro = function (def, ctx) {
    var d = def.data || {};
    var body = el("div", { class: "intro" });

    var left = el("div", { class: "intro__copy" });

    if (d.kicker) {
      left.appendChild(el("span", { class: "intro__kicker", text: d.kicker }));
    }

    var h = el("h1", { class: "intro__title" });
    (d.titleLines || []).forEach(function (line, i) {
      var span = el("span", { class: "intro__line", style: { "--i": i } }, line);
      h.appendChild(span);
    });
    left.appendChild(h);

    if (d.lead) left.appendChild(el("p", { class: "intro__lead", text: d.lead }));
    if (d.sub) left.appendChild(el("p", { class: "intro__sub", text: d.sub }));

    if (d.chips && d.chips.length) {
      var chips = el("ul", { class: "chips" });
      d.chips.forEach(function (c) {
        chips.appendChild(el("li", { class: "chip" }, [
          el("span", { class: "chip__dot" }),
          c
        ]));
      });
      left.appendChild(chips);
    }

    // illustration (double-bezel)
    var right = el("div", { class: "intro__art" }, [
      el("div", { class: "art-shell" }, [
        el("div", { class: "art-core", html: (App.art && App.art.heroSVG) ? App.art.heroSVG() : "" })
      ])
    ]);

    body.appendChild(left);
    body.appendChild(right);

    // CTA gère par l'écran (pas de scoring)
    ctx.enableContinue(d.cta || "Commencer", function () { App.next(); });

    return body;
  };

  /* ====================================================================
     FLIP — carte multi-faces ; clic = face suivante ; derniere face revele
     ==================================================================== */
  M.flip = function (def, ctx) {
    var d = def.data || {};
    var faces = d.faces || [];
    var answered = App.isAnswered(def.id);

    var idx = 0;
    var revealed = answered;

    var wrap = el("div", { class: "flip" });

    var shell = el("div", { class: "flip__shell" });
    var card = el("button", {
      class: "flip__card",
      attrs: { type: "button", "aria-live": "polite" }
    });
    shell.appendChild(card);

    var hint = el("p", { class: "flip__hint" });

    var dots = el("div", { class: "flip__dots", attrs: { "aria-hidden": "true" } });
    faces.forEach(function () { dots.appendChild(el("span", { class: "flip__dot" })); });

    function paint() {
      var f = faces[idx] || {};
      card.innerHTML = "";
      card.appendChild(el("span", { class: "flip__tag", text: f.tag || "" }));
      card.appendChild(el("p", { class: "flip__text", text: f.text || "" }));
      // animation de retournement (transform + opacity)
      if (!App.reducedMotion) {
        card.classList.remove("flip-anim");
        void card.offsetWidth;
        card.classList.add("flip-anim");
      }
      Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.classList.toggle("active", i === idx);
        dot.classList.toggle("seen", i <= idx);
      });
      var last = idx >= faces.length - 1;
      hint.textContent = last
        ? "Tu as parcouru toutes les faces."
        : "Touche la carte pour découvrir la suite (" + (idx + 1) + "/" + faces.length + ")";
      card.setAttribute("aria-label", (f.tag || "") + " : " + (f.text || ""));
    }

    function advance() {
      if (idx < faces.length - 1) {
        idx++;
        paint();
        if (idx >= faces.length - 1 && !revealed) finish();
      } else if (!revealed) {
        finish();
      }
    }

    function finish() {
      revealed = true;
      ctx.resolve({
        correct: true,
        points: def.points || 0,
        badge: def.badge || null,
        feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
        retain: d.retain || null,
        tone: "ok"
      });
    }

    card.addEventListener("click", advance);

    wrap.appendChild(shell);
    wrap.appendChild(hint);
    wrap.appendChild(dots);

    if (answered) {
      // revisite : montrer la derniere face + état resolu, sans re-scorer
      idx = faces.length - 1;
      paint();
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''), "ok");
      ctx.enableContinue("Continuer", function () { App.next(); });
    } else {
      paint();
    }

    return staggerWrap([wrap]);
  };

  /* ====================================================================
     QCM — choix unique ; mauvaise reponse : feedback corrige + reessai,
     bonne reponse : score
     ==================================================================== */
  M.qcm = function (def, ctx) {
    var d = def.data || {};
    var answered = App.isAnswered(def.id);

    var nodes = [];
    var done = false;

    var list = el("div", { class: "options", attrs: { rôle: "radiogroup", "aria-label": d.question || def.title } });

    (d.options || []).forEach(function (opt) {
      var btn = el("button", {
        class: "option",
        attrs: { type: "button", rôle: "radio", "aria-checked": "false" },
        dataset: { key: opt.key },
        on: {
          click: function () { choose(opt, btn); }
        }
      }, [
        el("span", { class: "option__key", text: opt.key }),
        el("span", { class: "option__text", text: opt.text })
      ]);
      nodes.push(btn);
      list.appendChild(btn);
    });

    function choose(opt, btn) {
      if (done) return;
      var correct = opt.key === d.correct;
      btn.setAttribute("aria-checked", "true");
      if (correct) {
        setChoiceState(btn, "correct");
        lockGroup(nodes);
        done = true;
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          value: opt.key,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        setChoiceState(btn, "wrong");
        btn.disabled = true;
        // feedback corrige + invitation a reessayer
        ctx.setFeedback(
          '<p><strong>Pas tout à fait.</strong> Essaie encore : reprends la situation et choisis le réflexe le plus sûr.</p>',
          "alert"
        );
      }
    }

    function showResolved() {
      // re-afficher la bonne reponse sans re-scorer
      nodes.forEach(function (n) {
        if (n.dataset.key === d.correct) setChoiceState(n, "correct");
        else setChoiceState(n, "muted");
      });
      lockGroup(nodes);
      done = true;
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''), "ok");
      ctx.enableContinue("Continuer", function () { App.next(); });
    }

    if (answered) showResolved();

    // list est mute par showResolved() le cas echeant : on le renvoie tel quel
    return staggerWrap([
      situationBlock(d.situation),
      questionBlock(d.question),
      list
    ].filter(Boolean));
  };

  /* ====================================================================
     TRUEFALSE — affirmations sequentielles ; points si tout correct
     ==================================================================== */
  M.truefalse = function (def, ctx) {
    var d = def.data || {};
    var items = d.items || [];
    var answered = App.isAnswered(def.id);

    var step = 0;
    var allCorrect = true;
    var done = false;

    var progress = el("p", { class: "tf__progress" });
    var stage = el("div", { class: "tf__stage" });

    function renderItem() {
      var it = items[step];
      stage.innerHTML = "";
      progress.textContent = "Affirmation " + (step + 1) + " / " + items.length;

      var card = el("div", { class: "tf__card art-shell" }, [
        el("div", { class: "tf__core art-core" }, [
          el("p", { class: "tf__statement", text: it.statement })
        ])
      ]);

      var actions = el("div", { class: "tf__actions" });
      var feedbackSlot = el("div", { class: "tf__inline" });

      var btnTrue = answerBtn("Vrai", true);
      var btnFalse = answerBtn("Faux", false);

      function answerBtn(label, val) {
        return el("button", {
          class: "btn btn--choice tf__btn",
          attrs: { type: "button" },
          on: { click: function () { pick(val, val ? btnTrue : btnFalse, val ? btnFalse : btnTrue); } }
        }, [el("span", { class: "btn__label", text: label })]);
      }

      function pick(val, picked, other) {
        var good = val === it.answer;
        if (!good) allCorrect = false;
        picked.classList.add(good ? "is-correct" : "is-wrong");
        // marquer la bonne reponse
        if (!good) other.classList.add("is-correct");
        btnTrue.disabled = true; btnFalse.disabled = true;
        feedbackSlot.innerHTML = "";
        feedbackSlot.appendChild(el("div", {
          class: "tf__verdict is-" + (good ? "ok" : "alert"),
          html: '<span class="tf__vicon">' + App.icon(good ? "check" : "alert") + '</span>' +
            '<span>' + App.escapeHtml(it.feedback || "") + '</span>'
        }));

        var nextBtn = el("button", {
          class: "btn btn--soft tf__next",
          attrs: { type: "button" },
          on: { click: nextItem }
        }, [
          el("span", { class: "btn__label", text: step < items.length - 1 ? "Affirmation suivante" : "Voir le bilan" }),
          el("span", { class: "btn__icon", html: App.icon("arrow") })
        ]);
        feedbackSlot.appendChild(nextBtn);
      }

      function nextItem() {
        if (step < items.length - 1) { step++; renderItem(); }
        else finish();
      }

      actions.appendChild(btnTrue);
      actions.appendChild(btnFalse);
      stage.appendChild(card);
      stage.appendChild(actions);
      stage.appendChild(feedbackSlot);
    }

    function finish() {
      done = true;
      if (allCorrect) {
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          feedbackHTML: '<p>Tu as tout juste. Ces repères sont des réflexes professionnels normaux.</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        // pas de points, mais on revele le sens (et l idempotence : marque resolu)
        App.recordAnswer(def.id, false);
        ctx.setFeedback(
          '<p>Tu peux retenir le sens : une précision ou un appui demandes à temps font partie du travail.</p>' +
          (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
          "warn"
        );
        ctx.enableContinue("Continuer", function () { App.next(); });
      }
    }

    if (answered) {
      // revisite : montrer le bilan resolu sans re-scorer
      done = true;
      progress.textContent = items.length + " affirmation" + (items.length > 1 ? "s" : "");
      var recap = el("ul", { class: "tf__recap" });
      items.forEach(function (it) {
        recap.appendChild(el("li", { class: "tf__recap-item" }, [
          el("span", { class: "tf__recap-icon", html: App.icon("check") }),
          el("span", {}, [
            el("strong", { text: (it.answer ? "Vrai. " : "Faux. ") }),
            it.feedback || ""
          ])
        ]));
      });
      stage.appendChild(recap);
      var scored = App.getAnswer(def.id);
      var wasOk = scored && scored.scored;
      ctx.setFeedback(
        '<p>' + (wasOk ? "Tu avais tout juste." : "Retiens le sens de ces affirmations.") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
        wasOk ? "ok" : "warn"
      );
      ctx.enableContinue("Continuer", function () { App.next(); });
    } else {
      renderItem();
    }

    return staggerWrap([progress, stage]);
  };

  /* ====================================================================
     THERMOMETER — placer un niveau (vert/orange/rouge) ; bon = dans correct[]
     ==================================================================== */
  M.thermometer = function (def, ctx) {
    var d = def.data || {};
    var levels = d.levels || [];
    var answered = App.isAnswered(def.id);
    var done = false;
    var nodes = [];

    var scale = el("div", { class: "thermo", attrs: { rôle: "radiogroup", "aria-label": d.question || def.title } });

    levels.forEach(function (lv) {
      var btn = el("button", {
        class: "thermo__level thermo--" + lv.key,
        attrs: { type: "button", rôle: "radio", "aria-checked": "false" },
        dataset: { key: lv.key },
        on: { click: function () { pick(lv, btn); } }
      }, [
        el("span", { class: "thermo__bead" }),
        el("span", { class: "thermo__body" }, [
          el("span", { class: "thermo__label", text: lv.label }),
          el("span", { class: "thermo__desc", text: lv.desc || "" })
        ])
      ]);
      nodes.push(btn);
      scale.appendChild(btn);
    });

    function isCorrect(key) {
      return (d.correct || []).indexOf(key) !== -1;
    }

    function pick(lv, btn) {
      if (done) return;
      btn.setAttribute("aria-checked", "true");
      var good = isCorrect(lv.key);
      lockGroup(nodes);
      done = true;
      // mettre en avant les niveaux attendus
      nodes.forEach(function (n) {
        if (isCorrect(n.dataset.key)) n.classList.add("is-target");
      });
      setChoiceState(btn, good ? "correct" : "wrong");
      if (good) {
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          value: lv.key,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        App.recordAnswer(def.id, lv.key);
        ctx.setFeedback(
          '<p>Place plutôt la situation en vigilance ou en alerte : ces signaux méritent d’être pris au sérieux.</p>' +
          '<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
          (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
          "warn"
        );
        ctx.enableContinue("Continuer", function () { App.next(); });
      }
    }

    if (answered) {
      done = true;
      nodes.forEach(function (n) {
        if (isCorrect(n.dataset.key)) n.classList.add("is-target");
        else n.classList.add("is-muted");
      });
      lockGroup(nodes);
      var scored = App.getAnswer(def.id);
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
        (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue("Continuer", function () { App.next(); });
    }

    return staggerWrap([
      situationBlock(d.situation),
      questionBlock(d.question),
      scale
    ]);
  };

  /* ====================================================================
     DIALOGUE — bulles puis choix type qcm
     ==================================================================== */
  M.dialogue = function (def, ctx) {
    var d = def.data || {};
    var answered = App.isAnswered(def.id);
    var done = false;
    var nodes = [];

    var scene = d.scene ? el("p", { class: "dialogue__scene", text: d.scene }) : null;

    var bubbles = el("div", { class: "dialogue__bubbles" });
    (d.bubbles || []).forEach(function (b, i) {
      var mine = /toi|moi/i.test(b.who || "");
      bubbles.appendChild(el("div", {
        class: "bubble " + (mine ? "bubble--me" : "bubble--other") + (b.tone ? " bubble--" + b.tone : ""),
        style: { "--i": i }
      }, [
        el("span", { class: "bubble__who", text: b.who || "" }),
        b.img ? el("img", { class: "bubble__img", attrs: { src: b.img, alt: b.text || "" }, style: { maxWidth: "100%", height: "auto", display: "block", marginTop: "8px", borderRadius: "var(--r-sm)" } }) : el("p", { class: "bubble__text", text: b.text || "" })
      ]));
    });

    var list = el("div", { class: "options", attrs: { rôle: "radiogroup", "aria-label": d.question || def.title } });
    (d.options || []).forEach(function (opt) {
      var btn = el("button", {
        class: "option",
        attrs: { type: "button", rôle: "radio", "aria-checked": "false" },
        dataset: { key: opt.key },
        on: { click: function () { choose(opt, btn); } }
      }, [
        el("span", { class: "option__key", text: opt.key }),
        el("span", { class: "option__text", text: opt.text })
      ]);
      nodes.push(btn);
      list.appendChild(btn);
    });

    function choose(opt, btn) {
      if (done) return;
      var correct = opt.key === d.correct;
      btn.setAttribute("aria-checked", "true");
      if (correct) {
        setChoiceState(btn, "correct");
        lockGroup(nodes);
        done = true;
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          value: opt.key,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          tone: "ok"
        });
      } else {
        setChoiceState(btn, "wrong");
        btn.disabled = true;
        ctx.setFeedback('<p><strong>Pas le meilleur réflexe.</strong> Cherche l\'option qui aide à comprendre le sens du changement.</p>', "alert");
      }
    }

    function showResolved() {
      nodes.forEach(function (n) {
        if (n.dataset.key === d.correct) setChoiceState(n, "correct");
        else setChoiceState(n, "muted");
      });
      lockGroup(nodes);
      done = true;
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>', "ok");
      ctx.enableContinue("Continuer", function () { App.next(); });
    }

    if (answered) showResolved();

    return staggerWrap([
      scene,
      el("div", { class: "dialogue" }, [bubbles]),
      questionBlock(d.question),
      list
    ].filter(Boolean));
  };

  /* ====================================================================
     CHOICEPATH — choisir une option -> montre sa consequence ; bonne = good
     ==================================================================== */
  M.choicepath = function (def, ctx) {
    var d = def.data || {};
    var choices = d.choices || [];
    var answered = App.isAnswered(def.id);
    var done = false;
    var nodes = [];

    var list = el("div", { class: "paths" });
    choices.forEach(function (ch, i) {
      var card = el("button", {
        class: "path",
        attrs: { type: "button" },
        dataset: { idx: i },
        on: { click: function () { choose(ch, card); } }
      }, [
        el("span", { class: "path__icon", html: App.icon("route") }),
        el("span", { class: "path__main" }, [
          el("span", { class: "path__text", text: ch.text })
        ]),
        el("span", { class: "path__chev", html: App.icon("arrow") })
      ]);
      nodes.push(card);
      list.appendChild(card);
    });

    function revealConsequence(card, ch, withAnim) {
      // ajoute la consequence sous l option
      if (card.querySelector(".path__cons")) return;
      var cons = el("span", {
        class: "path__cons is-" + (ch.good ? "good" : "bad")
      }, [
        el("span", { class: "path__cons-icon", html: App.icon(ch.good ? "check" : "alert") }),
        el("span", { text: ch.consequence })
      ]);
      card.querySelector(".path__main").appendChild(cons);
      card.classList.add(ch.good ? "is-good" : "is-bad");
      if (withAnim && !App.reducedMotion) {
        cons.style.opacity = "0";
        cons.style.maxHeight = "0";
        requestAnimationFrame(function () {
          cons.style.transition = "opacity .3s var(--ease-out), max-height .35s var(--ease-out)";
          cons.style.opacity = "1";
          cons.style.maxHeight = "120px";
        });
      }
    }

    function choose(ch, card) {
      if (done) return;
      revealConsequence(card, ch, true);
      if (ch.good) {
        lockGroup(nodes);
        nodes.forEach(function (n) { if (n !== card) n.classList.add("is-muted"); });
        done = true;
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        card.disabled = true;
        ctx.setFeedback('<p><strong>Vois la consequence.</strong> Une autre option protège mieux ta pratique : essaie-la.</p>', "alert");
      }
    }

    if (answered) {
      done = true;
      choices.forEach(function (ch, i) {
        revealConsequence(nodes[i], ch, false);
        if (!ch.good) nodes[i].classList.add("is-muted");
        nodes[i].disabled = true;
      });
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''), "ok");
      ctx.enableContinue("Continuer", function () { App.next(); });
    }

    return staggerWrap([
      situationBlock(d.situation),
      list
    ]);
  };

  /* ====================================================================
     ORDERING — selectionner les bons réflexes (good:true), valider
     (multi-selection : on choisit tous les bons, on évite les distracteurs)
     ==================================================================== */
  M.ordering = function (def, ctx) {
    var d = def.data || {};
    var items = (d.items || []).slice();
    var answered = App.isAnswered(def.id);
    var done = false;

    // melange leger pour ne pas reveler l ordre (deterministe si reduced ? non, ok)
    var shuffled = items.map(function (it, i) { return { it: it, i: i }; });
    if (!answered) {
      for (var s = shuffled.length - 1; s > 0; s--) {
        var j = Math.floor(Math.random() * (s + 1));
        var t = shuffled[s]; shuffled[s] = shuffled[j]; shuffled[j] = t;
      }
    }

    var selected = {}; // idx -> true
    var grid = el("div", { class: "picks", attrs: { rôle: "group", "aria-label": d.instruction || def.title } });
    var nodes = [];

    shuffled.forEach(function (entry) {
      var it = entry.it;
      var idx = entry.i;
      var card = el("button", {
        class: "pick",
        attrs: { type: "button", "aria-pressed": "false" },
        dataset: { idx: idx },
        on: { click: function () { toggle(idx, card); } }
      }, [
        el("span", { class: "pick__box", html: App.icon("check") }),
        el("span", { class: "pick__text", text: it.text })
      ]);
      nodes.push(card);
      grid.appendChild(card);
    });

    function toggle(idx, card) {
      if (done) return;
      if (selected[idx]) { delete selected[idx]; card.classList.remove("is-on"); card.setAttribute("aria-pressed", "false"); }
      else { selected[idx] = true; card.classList.add("is-on"); card.setAttribute("aria-pressed", "true"); }
    }

    function validate() {
      if (done) return;
      // correct = tous les good selectionnes ET aucun distracteur
      var ok = true;
      items.forEach(function (it, i) {
        var chosen = !!selected[i];
        if (it.good && !chosen) ok = false;
        if (!it.good && chosen) ok = false;
      });
      done = true;
      // peindre le résultat
      nodes.forEach(function (n) {
        var i = parseInt(n.dataset.idx, 10);
        var it = items[i];
        n.disabled = true;
        if (it.good) n.classList.add(selected[i] ? "is-correct" : "is-missed");
        else n.classList.add(selected[i] ? "is-wrong" : "is-muted");
      });

      if (ok) {
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        App.recordAnswer(def.id, false);
        ctx.setFeedback(
          '<p><strong>Presque.</strong> Les bons réflexes sont surlignes en vert. Les distracteurs sont a éviter.</p>' +
          '<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
          (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
          "warn"
        );
        ctx.enableContinue("Continuer", function () { App.next(); });
      }
    }

    var validateBtn = el("button", {
      class: "btn btn--primary picks__validate",
      attrs: { type: "button" },
      on: { click: validate }
    }, [
      el("span", { class: "btn__label", text: "Valider ma selection" }),
      el("span", { class: "btn__icon", html: App.icon("check") })
    ]);

    if (answered) {
      done = true;
      // re-afficher : bons en vert, distracteurs neutres
      nodes.forEach(function (n) {
        var i = parseInt(n.dataset.idx, 10);
        var it = items[i];
        n.disabled = true;
        if (it.good) n.classList.add("is-correct", "is-on");
        else n.classList.add("is-muted");
      });
      var scored = App.getAnswer(def.id);
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
        (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue("Continuer", function () { App.next(); });
      return staggerWrap([
        el("p", { class: "instruction", text: d.instruction || "" }),
        grid
      ]);
    }

    return staggerWrap([
      el("p", { class: "instruction", text: d.instruction || "" }),
      grid,
      el("div", { class: "picks__foot" }, [validateBtn])
    ]);
  };

  /* ====================================================================
     WORKSTATION — VERSION GENERIQUE : selection des bons réglages parmi
     des distracteurs (override prevu en phase 2 : vrai drag & drop).
     data attendu (generique) : { instruction, settings:[{text,good}], feedback, retain }
     Tolerant : si data.settings absent, on derive depuis slots/pieces si fournis.
     ==================================================================== */
  M.workstation = function (def, ctx) {
    var d = def.data || {};
    // On reutilise la mécanique "selection" (comme ordering) en version generique.
    var settings = d.settings;
    if (!settings) {
      // tolerance : derive depuis good/distractors si fournis autrement
      settings = (d.good || []).map(function (t) { return { text: t, good: true }; })
        .concat((d.distractors || []).map(function (t) { return { text: t, good: false }; }));
    }
    // melange
    var pool = settings.slice();
    var answered = App.isAnswered(def.id);
    if (!answered) {
      for (var s = pool.length - 1; s > 0; s--) {
        var j = Math.floor(Math.random() * (s + 1));
        var t = pool[s]; pool[s] = pool[j]; pool[j] = t;
      }
    }
    // index stable par rapport a settings d origine
    var indexOf = function (entry) { return settings.indexOf(entry); };

    var selected = {};
    var done = false;
    var nodes = [];

    var grid = el("div", { class: "settings-grid", attrs: { rôle: "group", "aria-label": d.instruction || def.title } });
    pool.forEach(function (entry) {
      var i = indexOf(entry);
      var card = el("button", {
        class: "setting-card",
        attrs: { type: "button", "aria-pressed": "false" },
        dataset: { idx: i },
        on: { click: function () { toggle(i, card); } }
      }, [
        el("span", { class: "setting-card__check", html: App.icon("check") }),
        el("span", { class: "setting-card__text", text: entry.text })
      ]);
      nodes.push(card);
      grid.appendChild(card);
    });

    function toggle(i, card) {
      if (done) return;
      if (selected[i]) { delete selected[i]; card.classList.remove("is-on"); card.setAttribute("aria-pressed", "false"); }
      else { selected[i] = true; card.classList.add("is-on"); card.setAttribute("aria-pressed", "true"); }
    }

    function validate() {
      if (done) return;
      var ok = true;
      settings.forEach(function (it, i) {
        var chosen = !!selected[i];
        if (it.good && !chosen) ok = false;
        if (!it.good && chosen) ok = false;
      });
      done = true;
      paintResult();
      if (ok) {
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        App.recordAnswer(def.id, false);
        ctx.setFeedback(
          '<p><strong>Bon poste a ajuster.</strong> Les bons réglages sont en vert ; ce qui fatigue est a éviter.</p>' +
          '<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
          (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
          "warn"
        );
        ctx.enableContinue("Continuer", function () { App.next(); });
      }
    }

    function paintResult() {
      nodes.forEach(function (n) {
        var i = parseInt(n.dataset.idx, 10);
        var it = settings[i];
        n.disabled = true;
        if (it.good) n.classList.add(selected[i] ? "is-correct" : "is-missed");
        else n.classList.add(selected[i] ? "is-wrong" : "is-muted");
      });
    }

    var validateBtn = el("button", {
      class: "btn btn--primary",
      attrs: { type: "button" },
      on: { click: validate }
    }, [
      el("span", { class: "btn__label", text: "Valider les réglages" }),
      el("span", { class: "btn__icon", html: App.icon("check") })
    ]);

    var scene = el("div", { class: "ws-scene art-shell" }, [
      el("div", { class: "ws-scene__core art-core", html: (App.art && App.art.sceneSVG) ? App.art.sceneSVG() : "" })
    ]);

    if (answered) {
      done = true;
      nodes.forEach(function (n) {
        var i = parseInt(n.dataset.idx, 10);
        var it = settings[i];
        n.disabled = true;
        if (it.good) n.classList.add("is-correct", "is-on");
        else n.classList.add("is-muted");
      });
      var scored = App.getAnswer(def.id);
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
        (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue("Continuer", function () { App.next(); });
      return staggerWrap([
        el("p", { class: "instruction", text: d.instruction || "" }),
        scene,
        grid
      ]);
    }

    return staggerWrap([
      el("p", { class: "instruction", text: d.instruction || "" }),
      scene,
      grid,
      el("div", { class: "picks__foot" }, [validateBtn])
    ]);
  };

  /* ====================================================================
     HIDDEN — VERSION GENERIQUE : choisir les éléments à risque parmi des
     éléments surs (override prevu en phase 2 : vraie scene SVG cliquable).
     data : { instruction, hazards:[{id,label}], safe:[{id,label}], feedback, retain }
     ==================================================================== */
  M.hidden = function (def, ctx) {
    var d = def.data || {};
    var hazards = d.hazards || [];
    var safe = d.safe || [];
    var answered = App.isAnswered(def.id);

    // pool melange { label, hazard:Boolean, id }
    var pool = hazards.map(function (h) { return { id: h.id, label: h.label, hazard: true }; })
      .concat(safe.map(function (sf) { return { id: sf.id, label: sf.label, hazard: false }; }));
    if (!answered) {
      for (var s = pool.length - 1; s > 0; s--) {
        var j = Math.floor(Math.random() * (s + 1));
        var t = pool[s]; pool[s] = pool[j]; pool[j] = t;
      }
    }

    var selected = {};
    var done = false;
    var nodes = [];

    var grid = el("div", { class: "hazards", attrs: { rôle: "group", "aria-label": d.instruction || def.title } });
    pool.forEach(function (entry) {
      var card = el("button", {
        class: "hazard",
        attrs: { type: "button", "aria-pressed": "false" },
        dataset: { id: entry.id },
        on: { click: function () { toggle(entry.id, card); } }
      }, [
        el("span", { class: "hazard__mark", html: App.icon("eye") }),
        el("span", { class: "hazard__label", text: entry.label })
      ]);
      nodes.push(card);
      grid.appendChild(card);
    });

    function find(id) {
      for (var i = 0; i < pool.length; i++) if (pool[i].id === id) return pool[i];
      return null;
    }

    function toggle(id, card) {
      if (done) return;
      if (selected[id]) { delete selected[id]; card.classList.remove("is-on"); card.setAttribute("aria-pressed", "false"); }
      else { selected[id] = true; card.classList.add("is-on"); card.setAttribute("aria-pressed", "true"); }
    }

    function validate() {
      if (done) return;
      var ok = true;
      pool.forEach(function (entry) {
        var chosen = !!selected[entry.id];
        if (entry.hazard && !chosen) ok = false;
        if (!entry.hazard && chosen) ok = false;
      });
      done = true;
      paintResult();
      if (ok) {
        ctx.resolve({
          correct: true,
          points: def.points || 0,
          badge: def.badge || null,
          feedbackHTML: '<p>' + App.escapeHtml(d.feedback || "") + '</p>',
          retain: d.retain || null,
          tone: "ok"
        });
      } else {
        App.recordAnswer(def.id, false);
        ctx.setFeedback(
          '<p><strong>Bonne observation.</strong> Les éléments à risque sont surlignes ; le reste est sur.</p>' +
          '<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
          (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
          "warn"
        );
        ctx.enableContinue("Continuer", function () { App.next(); });
      }
    }

    function paintResult() {
      nodes.forEach(function (n) {
        var entry = find(n.dataset.id);
        n.disabled = true;
        if (entry.hazard) n.classList.add(selected[entry.id] ? "is-correct" : "is-missed");
        else n.classList.add(selected[entry.id] ? "is-wrong" : "is-muted");
      });
    }

    var validateBtn = el("button", {
      class: "btn btn--primary",
      attrs: { type: "button" },
      on: { click: validate }
    }, [
      el("span", { class: "btn__label", text: "Valider les zones a risque" }),
      el("span", { class: "btn__icon", html: App.icon("check") })
    ]);

    var scene = el("div", { class: "hidden-scene art-shell" }, [
      el("div", { class: "hidden-scene__core art-core", html: (App.art && App.art.sceneSVG) ? App.art.sceneSVG() : "" })
    ]);

    if (answered) {
      done = true;
      nodes.forEach(function (n) {
        var entry = find(n.dataset.id);
        n.disabled = true;
        if (entry.hazard) n.classList.add("is-correct", "is-on");
        else n.classList.add("is-muted");
      });
      var scored = App.getAnswer(def.id);
      ctx.setFeedback('<p>' + App.escapeHtml(d.feedback || "") + '</p>' +
        (d.retain ? '<p class="retain"><span class="retain__tag">A retenir</span>' + App.escapeHtml(d.retain) + '</p>' : ''),
        (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue("Continuer", function () { App.next(); });
      return staggerWrap([
        el("p", { class: "instruction", text: d.instruction || "" }),
        scene,
        grid
      ]);
    }

    return staggerWrap([
      el("p", { class: "instruction", text: d.instruction || "" }),
      scene,
      grid,
      el("div", { class: "picks__foot" }, [validateBtn])
    ]);
  };

  /* ====================================================================
     RESOURCES — informatif ; CTA Continuer (pas de scoring)
     ==================================================================== */
  M.resources = function (def, ctx) {
    var d = def.data || {};
    var intro = d.intro ? el("p", { class: "resources__intro", text: d.intro }) : null;

    var grid = el("ul", { class: "resources" });
    (d.contacts || []).forEach(function (c, i) {
      grid.appendChild(el("li", {
        class: "resource",
        style: { "--i": i }
      }, [
        el("span", { class: "resource__glyph", html: App.icon(c.icon || "users") }),
        el("div", { class: "resource__body" }, [
          el("span", { class: "resource__label", text: c.label }),
          c.desc ? el("span", { class: "resource__desc", text: c.desc }) : null
        ])
      ]));
    });

    var retain = d.retain ? el("div", { class: "resources__retain" }, [
      el("span", { class: "retain__tag", text: "A retenir" }),
      d.retain
    ]) : null;

    // pas de scoring : CTA directement actif
    ctx.enableContinue("Continuer", function () { App.next(); });

    return staggerWrap([intro, grid, retain].filter(Boolean));
  };

  /* ====================================================================
     FINAL — score / palier / badges + bouton recommencer / revoir
     ==================================================================== */
  M.final = function (def, ctx) {
    var d = def.data || {};
    var score = App.state.score;
    var max = App.state.maxScore;
    var tier = App.tierFor(d.tiers || [], score);

    var ring = el("div", { class: "final__ring art-shell" }, [
      el("div", { class: "final__ring-core art-core" }, [
        el("div", { class: "final__art", html: (App.art && App.art.finalSVG) ? App.art.finalSVG() : "" }),
        el("div", { class: "final__score" }, [
          el("span", { class: "final__score-value", text: String(score) }),
          el("span", { class: "final__score-max", text: "/ " + max })
        ]),
        el("span", { class: "final__score-label", text: "points de prévention" })
      ])
    ]);

    var tierBox = el("div", { class: "final__tier" }, [
      el("span", { class: "final__tier-kicker", text: "Palier atteint" }),
      el("p", { class: "final__tier-label", text: tier ? tier.label : "" })
    ]);

    var body = el("p", { class: "final__text", text: d.text || "" });

    // grille des badges gagnes
    var badgesWrap = el("div", { class: "final__badges" });
    badgesWrap.appendChild(el("h3", { class: "final__badges-title", text: "Badges débloqués (" + App.state.badges.length + ")" }));
    if (App.state.badges.length) {
      var bgrid = el("ul", { class: "final__badge-grid" });
      App.state.badges.forEach(function (b, i) {
        bgrid.appendChild(el("li", { class: "final__badge", style: { "--i": i } }, [
          el("span", { class: "final__badge-icon", html: App.icon("leaf") }),
          el("span", { class: "final__badge-label", text: b.label })
        ]));
      });
      badgesWrap.appendChild(bgrid);
    } else {
      badgesWrap.appendChild(el("p", { class: "badges__empty", text: "Aucun badge cette fois. Tu peux retenter le parcours." }));
    }

    // actions : revoir (revenir a 0) + recommencer (reset)
    var actions = el("div", { class: "final__actions" }, [
      el("button", {
        class: "btn btn--primary",
        attrs: { type: "button" },
        on: { click: function () { App.goto(0, { direction: "prev" }); } }
      }, [
        el("span", { class: "btn__label", text: d.cta || "Revoir les étapes" }),
        el("span", { class: "btn__icon", html: App.icon("arrow") })
      ]),
      el("button", {
        class: "btn btn--ghost",
        attrs: { type: "button" },
        on: { click: function () { App.reset(); } }
      }, [
        el("span", { class: "btn__label", text: "Tout recommencer" }),
        el("span", { class: "btn__icon", html: App.icon("refresh") })
      ])
    ]);

    // pas de CTA footer additionnel ici (les actions sont dans le corps)

    var left = el("div", { class: "final__head" }, [ring, tierBox]);
    var right = el("div", { class: "final__copy" }, [body, badgesWrap, actions]);

    return staggerWrap([
      el("div", { class: "final" }, [left, right])
    ]);
  };

  App.mechanics = M;
})(window);
