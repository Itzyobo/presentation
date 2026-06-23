/* ==========================================================================
   mechanics-securite.js — nouvelles mecaniques du Livret Securite
   Branche les renderers dans le registre REEL du moteur : App.mechanics[kind]
   (le brief supposait App.renderers[type] ; on adapte, cf. 06 regle 2).

   Renderers standalone enregistres :
     texte, vrai_faux_series, cartes_a_retourner, drag_drop, mini_jeu,
     ressources_securite
   qcm_multi / association / drag_drop_zones ne servent que comme MANCHES de
   mini_jeu : ils vivent comme builders, pas comme kinds standalone.

   Chaque manche est un builder (data, host) -> noeud, ou
     host = { live, illustrationHTML, onResolved(correct|null, feedbackHTML) }
   correct === null = manche informative (non comptee dans le score).
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});
  var M = App.mechanics || (App.mechanics = {});
  var el = App.el;

  /* -------------------------------------------------- helpers communs */
  function slug(name) {
    var s = name.toLowerCase();
    if (s.normalize) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return s.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  }

  function feedbackCard(tone, html) {
    return el("div", { class: "feedback show is-" + tone }, [
      el("div", { class: "feedback__card" }, [
        el("span", { class: "feedback__icon", html: App.icon(tone === "ok" ? "check" : "alert") }),
        el("div", { class: "feedback__text", html: html })
      ])
    ]);
  }

  function retainHTML(tag, body) {
    return '<p class="retain"><span class="retain__tag">' + tag + '</span>' + body + '</p>';
  }

  function ctaButton(label, onClick) {
    return el("button", {
      class: "btn btn--primary", attrs: { type: "button" }, on: { click: onClick }
    }, [
      el("span", { class: "btn__label", text: label }),
      el("span", { class: "btn__icon", html: App.icon("arrow") })
    ]);
  }

  function illFor(m) {
    if (m.illustration_id && App.art && typeof App.art[m.illustration_id] === "function") {
      return App.art[m.illustration_id]();
    }
    return null;
  }

  /* ====================================================================
     BUILDER — QCM choix unique (manche)
     ==================================================================== */
  function buildQcmSingle(data, host) {
    var wrap = el("div", { class: "mj-block" });
    if (data.consigne) wrap.appendChild(el("div", { class: "situation" }, [el("p", { class: "situation__text", text: data.consigne })]));
    if (host.illustrationHTML) wrap.appendChild(el("div", { class: "mj-figure art-shell" }, [el("div", { class: "art-core", html: host.illustrationHTML })]));
    if (data.legendes && data.legendes.length) {
      wrap.appendChild(el("ul", { class: "mj-legendes" }, data.legendes.map(function (t) {
        return el("li", { class: "mj-legende", text: t });
      })));
    }
    if (data.question) wrap.appendChild(el("p", { class: "question", text: data.question }));

    var correctIdx = data.bonne_reponse_index;
    var list = el("div", { class: "options", attrs: { role: "radiogroup" } });
    var nodes = [];
    var locked = !host.live;

    (data.options || []).forEach(function (text, i) {
      var btn = el("button", {
        class: "option", attrs: { type: "button", role: "radio", "aria-checked": "false" },
        dataset: { i: i },
        on: { click: function () { pick(i); } }
      }, [
        el("span", { class: "option__key", text: String.fromCharCode(65 + i) }),
        el("span", { class: "option__text", text: text })
      ]);
      nodes.push(btn);
      list.appendChild(btn);
    });

    function lockAll() { nodes.forEach(function (n) { n.disabled = true; n.classList.add("locked"); }); }

    function reveal(pickedIdx) {
      nodes.forEach(function (n, i) {
        if (i === correctIdx) n.classList.add("is-correct");
        else if (i === pickedIdx) n.classList.add("is-wrong");
        else n.classList.add("is-muted");
      });
      lockAll();
    }

    function pick(i) {
      if (locked) return;
      locked = true;
      var ok = i === correctIdx;
      reveal(i);
      var html = "<p>" + App.escapeHtml(ok ? (data.feedback_correct || "") : (data.feedback_incorrect || "")) + "</p>";
      if (host.onResolved) host.onResolved(ok, html);
    }

    if (!host.live) reveal(-1);
    wrap.appendChild(list);
    return wrap;
  }

  /* ====================================================================
     BUILDER — QCM multi (manche)
     ==================================================================== */
  function buildQcmMulti(data, host) {
    var wrap = el("div", { class: "mj-block" });
    if (data.consigne) wrap.appendChild(el("p", { class: "instruction", text: data.consigne }));
    if (host.illustrationHTML) wrap.appendChild(el("div", { class: "mj-figure art-shell" }, [el("div", { class: "art-core", html: host.illustrationHTML })]));
    if (data.description_scene) wrap.appendChild(el("div", { class: "situation" }, [el("p", { class: "situation__text", text: data.description_scene })]));

    var corrects = data.bonnes_reponses_index || [];
    function isCorrect(i) { return corrects.indexOf(i) !== -1; }

    var grid = el("div", { class: "picks", attrs: { role: "group" } });
    var nodes = [];
    var selected = {};
    var locked = !host.live;

    (data.options || []).forEach(function (text, i) {
      var card = el("button", {
        class: "pick", attrs: { type: "button", "aria-pressed": "false" },
        dataset: { i: i },
        on: { click: function () { toggle(i, card); } }
      }, [
        el("span", { class: "pick__box", html: App.icon("check") }),
        el("span", { class: "pick__text", text: text })
      ]);
      nodes.push(card);
      grid.appendChild(card);
    });

    function toggle(i, card) {
      if (locked) return;
      if (selected[i]) { delete selected[i]; card.classList.remove("is-on"); card.setAttribute("aria-pressed", "false"); }
      else { selected[i] = true; card.classList.add("is-on"); card.setAttribute("aria-pressed", "true"); }
    }

    function paint() {
      nodes.forEach(function (n, i) {
        n.disabled = true;
        if (isCorrect(i)) n.classList.add(selected[i] ? "is-correct" : "is-missed");
        else n.classList.add(selected[i] ? "is-wrong" : "is-muted");
      });
    }

    function resolve() {
      if (locked) return;
      locked = true;
      var ok = (data.options || []).every(function (_, i) { return !!selected[i] === isCorrect(i); });
      paint();
      var html = "<p>" + App.escapeHtml(ok ? (data.feedback_si_reussi || "") : (data.feedback_si_erreurs || "")) + "</p>";
      footSlot.innerHTML = "";
      if (host.onResolved) host.onResolved(ok, html);
    }

    wrap.appendChild(grid);
    var footSlot = el("div", { class: "mj-foot" });
    wrap.appendChild(footSlot);

    if (host.live) {
      footSlot.appendChild(el("button", {
        class: "btn btn--primary", attrs: { type: "button" }, on: { click: resolve }
      }, [
        el("span", { class: "btn__label", text: "Valider" }),
        el("span", { class: "btn__icon", html: App.icon("check") })
      ]));
    } else {
      // vue resolue : bonnes reponses surlignees
      nodes.forEach(function (n, i) { n.disabled = true; if (isCorrect(i)) n.classList.add("is-correct", "is-on"); else n.classList.add("is-muted"); });
    }
    return wrap;
  }

  /* ====================================================================
     BUILDER — Vrai / Faux en serie (manche + standalone)
     ==================================================================== */
  function buildVraiFaux(data, host) {
    var series = data.series || [];
    var wrap = el("div", { class: "vf mj-block" });
    var intro = data.texte_introduction || data.consigne;
    if (intro) wrap.appendChild(el("p", { class: "instruction", text: intro }));

    var progress = el("p", { class: "tf__progress" });
    var stage = el("div", { class: "tf__stage" });
    wrap.appendChild(progress);
    wrap.appendChild(stage);

    var step = 0, allCorrect = true;

    function renderItem() {
      var it = series[step];
      var good = it.bonne_reponse === "vrai";
      stage.innerHTML = "";
      progress.textContent = "Affirmation " + (step + 1) + " / " + series.length;

      var card = el("div", { class: "tf__card art-shell" }, [
        el("div", { class: "tf__core art-core" }, [el("p", { class: "tf__statement", text: it.affirmation })])
      ]);
      var actions = el("div", { class: "tf__actions" });
      var slot = el("div", { class: "tf__inline" });

      var bTrue = choice("Vrai", true), bFalse = choice("Faux", false);
      function choice(label, val) {
        return el("button", {
          class: "btn btn--choice tf__btn", attrs: { type: "button" },
          on: { click: function () { pick(val); } }
        }, [el("span", { class: "btn__label", text: label })]);
      }

      function pick(val) {
        var ok = val === good;
        if (!ok) allCorrect = false;
        bTrue.disabled = true; bFalse.disabled = true;
        (val ? bTrue : bFalse).classList.add(ok ? "is-correct" : "is-wrong");
        if (!ok) (good ? bTrue : bFalse).classList.add("is-correct");
        slot.innerHTML = "";
        slot.appendChild(el("div", {
          class: "tf__verdict is-" + (ok ? "ok" : "alert"),
          html: '<span class="tf__vicon">' + App.icon(ok ? "check" : "alert") + "</span><span>" + App.escapeHtml(it.feedback || "") + "</span>"
        }));
        var last = step >= series.length - 1;
        slot.appendChild(el("button", {
          class: "btn btn--soft tf__next", attrs: { type: "button" },
          on: { click: function () { if (last) finish(); else { step++; renderItem(); } } }
        }, [
          el("span", { class: "btn__label", text: last ? "Voir le résultat" : "Affirmation suivante" }),
          el("span", { class: "btn__icon", html: App.icon("arrow") })
        ]));
      }

      actions.appendChild(bTrue); actions.appendChild(bFalse);
      stage.appendChild(card); stage.appendChild(actions); stage.appendChild(slot);
    }

    function finish() {
      var html = allCorrect
        ? "<p>Tout juste : ces repères sont des réflexes professionnels normaux.</p>"
        : "<p>Retiens le sens de ces affirmations : elles font partie des bons réflexes de prévention.</p>";
      if (host.onResolved) host.onResolved(allCorrect, html);
    }

    if (host.live) {
      renderItem();
    } else {
      // vue resolue : recap
      progress.textContent = series.length + " affirmation" + (series.length > 1 ? "s" : "");
      var recap = el("ul", { class: "tf__recap" });
      series.forEach(function (it) {
        recap.appendChild(el("li", { class: "tf__recap-item" }, [
          el("span", { class: "tf__recap-icon", html: App.icon("check") }),
          el("span", {}, [el("strong", { text: (it.bonne_reponse === "vrai" ? "Vrai. " : "Faux. ") }), it.feedback || ""])
        ]));
      });
      stage.appendChild(recap);
    }
    return wrap;
  }

  /* ====================================================================
     BUILDER — Manche informative (texte)
     ==================================================================== */
  function buildTexteManche(data, host) {
    var wrap = el("div", { class: "mj-block sec-prose", html: data.texte || "" });
    // informative : on signale tout de suite "fait" (non comptee dans le score)
    if (host.live && host.onResolved) host.onResolved(null, null);
    return wrap;
  }

  var mancheBuilders = {
    qcm: buildQcmSingle,
    qcm_multi: buildQcmMulti,
    vrai_faux_series: buildVraiFaux,
    texte: buildTexteManche,
    drag_drop_zones: function (m, host) { return App.buildDragZones(m, host); },
    association: function (m, host) { return App.buildAssociation(m, host); }
  };

  /* ====================================================================
     MECANIQUE — texte (ecran informatif)
     ==================================================================== */
  M.texte = function (def, ctx) {
    var d = def.data || {};
    var wrap = el("div", { class: "sec-screen" }, [
      el("div", { class: "sec-prose", html: d.texte || "" })
    ]);
    ctx.enableContinue(d.bouton || "Continuer", function () { App.next(); });
    return wrap;
  };

  /* ====================================================================
     MECANIQUE — cartes_a_retourner (flip 3D, sans scoring)
     ==================================================================== */
  M.cartes_a_retourner = function (def, ctx) {
    var d = def.data || {};
    var wrap = el("div", { class: "sec-screen" });
    if (d.texte) wrap.appendChild(el("p", { class: "instruction", text: d.texte }));

    var grid = el("div", { class: "cards-grid" });
    (d.cartes || []).forEach(function (c) {
      var card = el("button", {
        class: "flip-card", attrs: { type: "button", "aria-label": c.titre_carte + " — retourner la carte" }
      }, [
        el("div", { class: "flip-card__inner" }, [
          el("div", { class: "flip-card__face flip-card__front" }, [
            el("span", { class: "flip-card__title", text: c.titre_carte }),
            el("span", { class: "flip-card__hint", html: App.icon("flip") })
          ]),
          el("div", { class: "flip-card__face flip-card__back" }, [
            el("span", { class: "flip-card__back-text", html: c.texte_verso }),
            el("span", { class: "flip-card__read", html: App.icon("check") })
          ])
        ])
      ]);
      card.addEventListener("click", function () {
        var f = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", f ? "true" : "false");
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);

    ctx.enableContinue(d.bouton || "Continuer", function () { App.next(); });
    return wrap;
  };

  /* ====================================================================
     MECANIQUE — vrai_faux_series (standalone, 1 pt si tout juste)
     ==================================================================== */
  M.vrai_faux_series = function (def, ctx) {
    var d = def.data || {};
    var answered = App.isAnswered(def.id);
    var host = {
      live: !answered,
      illustrationHTML: null,
      onResolved: function (correct, html) {
        if (correct) {
          ctx.resolve({ correct: true, points: def.points || 0, badge: def.badge || null, feedbackHTML: html, tone: "ok" });
        } else {
          App.recordAnswer(def.id, false);
          ctx.setFeedback(html, "warn");
          ctx.enableContinue(d.bouton || "Continuer", function () { App.next(); });
        }
      }
    };
    var node = buildVraiFaux(d, host);
    if (answered) {
      var scored = App.getAnswer(def.id);
      ctx.setFeedback("<p>" + ((scored && scored.scored) ? "Tu avais tout juste." : "Retiens le sens de ces affirmations.") + "</p>",
        (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue(d.bouton || "Continuer", function () { App.next(); });
    }
    return el("div", { class: "sec-screen" }, [node]);
  };

  /* ====================================================================
     MECANIQUE — drag_drop standalone (remettre dans l'ordre)
     ==================================================================== */
  M.drag_drop = function (def, ctx) {
    var d = def.data || {};
    var answered = App.isAnswered(def.id);
    var host = {
      live: !answered,
      illustrationHTML: illFor(d),
      onResolved: function (correct, html) {
        if (correct) {
          ctx.resolve({ correct: true, points: def.points || 0, badge: def.badge || null, feedbackHTML: html, tone: "ok" });
        } else {
          App.recordAnswer(def.id, false);
          ctx.setFeedback(html, "warn");
          ctx.enableContinue("Continuer", function () { App.next(); });
        }
      }
    };
    var node = App.buildSortable(d, host);
    if (answered) {
      var scored = App.getAnswer(def.id);
      ctx.setFeedback("<p>" + App.escapeHtml(d.feedback_si_bon_ordre || "") + "</p>", (scored && scored.scored) ? "ok" : "warn");
      ctx.enableContinue("Continuer", function () { App.next(); });
    }
    return el("div", { class: "sec-screen" }, [node]);
  };

  /* ====================================================================
     MECANIQUE — mini_jeu (wrapper : N manches sequentielles)
     ==================================================================== */
  M.mini_jeu = function (def, ctx) {
    var d = def.data || {};
    var manches = d.manches || [];
    var answered = App.isAnswered(def.id);

    var wrap = el("div", { class: "minijeu sec-screen" });
    if (d.texte_introduction) wrap.appendChild(el("p", { class: "instruction", text: d.texte_introduction }));

    var dots = el("div", { class: "manche-indicator", attrs: { "aria-hidden": "true" } });
    var dotNodes = manches.map(function () { var n = el("span", { class: "manche-dot" }); dots.appendChild(n); return n; });
    wrap.appendChild(dots);

    var stage = el("div", { class: "minijeu__stage" });
    wrap.appendChild(stage);

    var results = [];   // par manche : true | false | null(informative)
    var idx = 0;

    function setDots() {
      dotNodes.forEach(function (n, i) {
        n.className = "manche-dot" +
          (i === idx ? " is-active" : "") +
          (results[i] === true ? " is-done" : "") +
          (results[i] === false ? " is-failed" : "");
      });
    }

    function scoredResults() { return results.filter(function (r) { return r !== null && r !== undefined; }); }

    function finish() {
      var sr = scoredResults();
      var nb = sr.filter(Boolean).length;
      var seuil = d.seuil_reussite || sr.length;
      var point = nb >= seuil ? 1 : 0;

      if (!App.isAnswered(def.id)) {
        App.recordAnswer(def.id, { results: results, point: point });
        if (point) {
          App.addScore(def.points || 0, def.id);
          if (def.badge) App.awardBadge(def.badge);
        }
      }
      var ok = point === 1;
      ctx.setFeedback(
        "<p>" + (ok
          ? "Mini-jeu réussi ! " + nb + " / " + sr.length + " manches réussies."
          : "Mini-jeu terminé : " + nb + " / " + sr.length + " manches réussies. Tu peux y revenir quand tu veux.") + "</p>",
        ok ? "ok" : "warn");
      ctx.enableContinue(d.bouton_fin || "Continuer", function () { App.next(); });
    }

    function renderManche() {
      stage.innerHTML = "";
      setDots();
      var m = manches[idx];
      stage.appendChild(el("h3", { class: "manche-title" }, [
        el("span", { class: "manche-title__tag", text: "Manche " + (idx + 1) + " / " + manches.length }),
        el("span", { class: "manche-title__text", text: (m.titre_manche || "").replace(/^Manche[^—-]*[—-]\s*/, "") })
      ]));

      var footSlot = el("div", { class: "minijeu__resolve" });

      var host = {
        live: true,
        illustrationHTML: illFor(m),
        onResolved: function (correct, html) {
          results[idx] = correct;
          setDots();
          footSlot.innerHTML = "";
          if (html) footSlot.appendChild(feedbackCard(correct ? "ok" : "alert", html));
          var last = idx >= manches.length - 1;
          footSlot.appendChild(el("div", { class: "minijeu__foot" }, [
            ctaButton(last ? "Voir le résultat" : "Manche suivante", function () {
              if (last) finish(); else { idx++; renderManche(); }
            })
          ]));
        }
      };

      var builder = mancheBuilders[m.type];
      if (typeof builder === "function") {
        stage.appendChild(builder(m, host));
      } else {
        stage.appendChild(el("p", { class: "lead", text: "Manche inconnue : " + m.type }));
      }
      stage.appendChild(footSlot);
    }

    if (answered) {
      // ponytail: en revisite, on montre un recap (pas un rejeu complet)
      var saved = App.getAnswer(def.id);
      var v = (saved && saved.value) || {};
      (v.results || []).forEach(function (r, i) { results[i] = r; });
      idx = -1; setDots();
      stage.appendChild(el("p", { class: "lead", text: "Tu as déjà terminé ce mini-jeu." }));
      ctx.setFeedback("<p>" + (v.point ? "Mini-jeu réussi." : "Mini-jeu terminé — tu peux y revenir pour t'entraîner.") + "</p>",
        v.point ? "ok" : "warn");
      ctx.enableContinue(d.bouton_fin || "Continuer", function () { App.next(); });
    } else {
      renderManche();
    }

    return wrap;
  };

  /* ====================================================================
     MECANIQUE — ressources_securite (recap acteurs, photos + fallback)
     ==================================================================== */
  M.ressources_securite = function (def, ctx) {
    var d = def.data || {};
    var wrap = el("div", { class: "sec-screen" });
    if (d.introduction) wrap.appendChild(el("p", { class: "resources__intro", text: d.introduction }));

    var list = el("div", { class: "recap-blocs" });
    (d.blocs || []).forEach(function (b) {
      var head = el("div", { class: "recap-bloc__head" }, [
        el("span", { class: "resource__glyph", html: App.icon(b.icone || "users") }),
        el("div", { class: "recap-bloc__heading" }, [
          el("h3", { class: "recap-bloc__title", text: b.sous_titre }),
          b.legende ? el("span", { class: "recap-bloc__leg", text: b.legende }) : null
        ])
      ]);

      var people = null;
      if (b.personnes && b.personnes.length) {
        people = el("div", { class: "recap-people" }, b.personnes.map(function (p) {
          return el("span", { class: "recap-person" }, [
            el("img", {
              class: "recap-person__photo",
              attrs: { src: "assets/" + slug(p) + ".jpg", alt: "", loading: "lazy" },
              on: { error: function (e) { e.target.style.display = "none"; } }
            }),
            el("span", { class: "recap-person__name", text: p })
          ]);
        }));
      }

      list.appendChild(el("div", { class: "recap-bloc" }, [
        head, people, el("p", { class: "recap-bloc__text", text: b.contenu })
      ]));
    });
    wrap.appendChild(list);

    if (d.message_cloture) {
      wrap.appendChild(el("div", { class: "resources__retain" }, [
        el("span", { class: "retain__tag", text: "À retenir" }), d.message_cloture
      ]));
    }

    ctx.enableContinue(d.bouton || "Terminer", function () { App.next(); });
    return wrap;
  };

  App.mechanics = M;
})(window);
