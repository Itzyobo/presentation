/* ==========================================================================
   screen-dragdrop.js — modules glisser-deposer (Pointer Events)
   Expose :
     App.buildSortable(data, host)  -> remettre des elements dans l'ordre
     App.buildDragZones(data, host) -> deposer les bons elements dans une zone

   On utilise les POINTER EVENTS (pointerdown/move/up) qui unifient souris,
   tactile et stylet en un seul chemin de code : cela couvre le fallback mobile
   exige par le brief (regle 4) sans dupliquer une branche touch separee.

   host = {
     live: bool,                 // true = interactif ; false = vue resolue
     illustrationHTML: string,   // optionnel
     onResolved: fn(correct, feedbackHTML)  // appele une fois (mode live)
   }
   Renvoie un noeud DOM.
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});
  var el = App.el;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort();
    var sb = b.slice().sort();
    return arraysEqual(sa, sb);
  }

  /* ====================================================================
     SORTABLE — reordonner une liste verticale
     ==================================================================== */
  App.buildSortable = function (data, host) {
    host = host || {};
    var correct = (data.elements_a_ordonner || []).slice();
    var wrap = el("div", { class: "dd" });

    if (data.texte) wrap.appendChild(el("p", { class: "instruction", text: data.texte }));
    if (host.illustrationHTML) {
      wrap.appendChild(el("div", { class: "dd-figure art-shell" }, [
        el("div", { class: "art-core", html: host.illustrationHTML })
      ]));
    }

    var list = el("div", { class: "dd-list", attrs: { role: "list", "aria-label": "Éléments à remettre dans l'ordre" } });

    // ordre de depart : melange garanti different de la solution
    var order = correct.slice();
    if (host.live) {
      var guard = 0;
      do { shuffle(order); guard++; } while (arraysEqual(order, correct) && guard < 12 && correct.length > 1);
    }

    var locked = !host.live;

    function makeItem(txt) {
      var handle = el("span", { class: "drag-item__handle", html: App.icon("route"), attrs: { "aria-hidden": "true" } });
      var item = el("div", {
        class: "drag-item",
        attrs: { role: "listitem", tabindex: "0", "aria-label": txt },
        dataset: { text: txt }
      }, [
        handle,
        el("span", { class: "drag-item__text", text: txt })
      ]);
      attachPointer(item);
      attachKeys(item);
      return item;
    }

    function currentOrder() {
      return Array.prototype.map.call(list.children, function (n) { return n.dataset.text; });
    }

    /* --- pointer drag : swap en direct via elementFromPoint --- */
    function attachPointer(item) {
      item.addEventListener("pointerdown", function (e) {
        if (locked) return;
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();
        item.setPointerCapture(e.pointerId);
        item.classList.add("is-dragging");
        item.style.pointerEvents = "none"; // pour qu'elementFromPoint voie dessous

        function move(ev) {
          var under = document.elementFromPoint(ev.clientX, ev.clientY);
          var target = under && under.closest ? under.closest(".drag-item") : null;
          if (!target || target === item || target.parentNode !== list) return;
          var r = target.getBoundingClientRect();
          var before = ev.clientY < r.top + r.height / 2;
          list.insertBefore(item, before ? target : target.nextSibling);
        }
        function up(ev) {
          item.releasePointerCapture(e.pointerId);
          item.classList.remove("is-dragging");
          item.style.pointerEvents = "";
          item.removeEventListener("pointermove", move);
          item.removeEventListener("pointerup", up);
          item.removeEventListener("pointercancel", up);
        }
        item.addEventListener("pointermove", move);
        item.addEventListener("pointerup", up);
        item.addEventListener("pointercancel", up);
      });
    }

    /* --- clavier : fleches haut/bas deplacent l'element focalise --- */
    function attachKeys(item) {
      item.addEventListener("keydown", function (e) {
        if (locked) return;
        if (e.key === "ArrowUp" && item.previousSibling) {
          e.preventDefault();
          list.insertBefore(item, item.previousSibling);
          item.focus();
        } else if (e.key === "ArrowDown" && item.nextSibling) {
          e.preventDefault();
          list.insertBefore(item.nextSibling, item);
          item.focus();
        }
      });
    }

    order.forEach(function (txt) { list.appendChild(makeItem(txt)); });
    wrap.appendChild(list);

    var footSlot = el("div", { class: "dd-foot" });
    wrap.appendChild(footSlot);

    function paintResult(ok) {
      Array.prototype.forEach.call(list.children, function (n, i) {
        n.classList.add(n.dataset.text === correct[i] ? "is-correct" : "is-wrong");
        n.setAttribute("tabindex", "-1");
      });
    }

    function resolve() {
      if (locked) return;
      locked = true;
      var ok = arraysEqual(currentOrder(), correct);
      paintResult(ok);
      var html = "<p>" + App.escapeHtml(ok ? (data.feedback_si_bon_ordre || "") : (data.feedback_si_mauvais_ordre || "")) + "</p>";
      if (!ok) {
        html += '<p class="retain"><span class="retain__tag">Le bon ordre</span>' +
          correct.map(function (t, i) { return (i + 1) + ". " + App.escapeHtml(t); }).join("<br>") + "</p>";
      }
      footSlot.innerHTML = "";
      if (host.onResolved) host.onResolved(ok, html);
    }

    if (host.live) {
      footSlot.appendChild(el("button", {
        class: "btn btn--primary", attrs: { type: "button" }, on: { click: resolve }
      }, [
        el("span", { class: "btn__label", text: "Valider l'ordre" }),
        el("span", { class: "btn__icon", html: App.icon("check") })
      ]));
    } else {
      // vue resolue : ordre correct affiche, verrouille
      list.innerHTML = "";
      correct.forEach(function (txt) {
        var n = makeItem(txt); n.classList.add("is-correct"); n.setAttribute("tabindex", "-1");
        list.appendChild(n);
      });
    }

    return wrap;
  };

  /* ====================================================================
     DRAG ZONES — deposer les bons elements dans une zone cible
     (triangle du feu : choisir 3 ingredients parmi 5)
     ==================================================================== */
  App.buildDragZones = function (data, host) {
    host = host || {};
    var corrects = (data.elements_corrects || []).slice();
    var pool = (data.elements_disponibles || []).slice();

    var wrap = el("div", { class: "dd" });
    if (data.consigne) wrap.appendChild(el("p", { class: "instruction", text: data.consigne }));

    var zone = el("div", {
      class: "dd-zone", attrs: { "aria-label": "Zone cible : le triangle du feu" }
    }, [
      host.illustrationHTML ? el("div", { class: "dd-zone__art", html: host.illustrationHTML }) : null,
      el("p", { class: "dd-zone__hint", text: "Dépose ici les 3 ingrédients du feu" })
    ]);
    var bank = el("div", { class: "dd-bank", attrs: { "aria-label": "Éléments disponibles" } });

    var locked = !host.live;

    function makeChip(txt) {
      var chip = el("div", {
        class: "dd-chip", attrs: { role: "button", tabindex: "0", "aria-label": txt },
        dataset: { text: txt }
      }, [
        el("span", { class: "dd-chip__grip", html: App.icon("dot"), attrs: { "aria-hidden": "true" } }),
        el("span", { class: "dd-chip__text", text: txt })
      ]);
      attachDrag(chip);
      attachTap(chip);
      return chip;
    }

    function attachDrag(chip) {
      chip.addEventListener("pointerdown", function (e) {
        if (locked) return;
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();
        chip.setPointerCapture(e.pointerId);
        chip.classList.add("is-dragging");
        var startX = e.clientX, startY = e.clientY;
        chip.style.pointerEvents = "none";

        function move(ev) {
          chip.style.transform = "translate(" + (ev.clientX - startX) + "px," + (ev.clientY - startY) + "px)";
          var under = document.elementFromPoint(ev.clientX, ev.clientY);
          var cont = under && under.closest ? under.closest(".dd-zone,.dd-bank") : null;
          zone.classList.toggle("is-over", cont === zone);
          bank.classList.toggle("is-over", cont === bank);
        }
        function up(ev) {
          chip.releasePointerCapture(e.pointerId);
          chip.classList.remove("is-dragging");
          chip.style.pointerEvents = "";
          chip.style.transform = "";
          zone.classList.remove("is-over"); bank.classList.remove("is-over");
          var under = document.elementFromPoint(ev.clientX, ev.clientY);
          var cont = under && under.closest ? under.closest(".dd-zone,.dd-bank") : null;
          if (cont === zone) zone.appendChild(chip);
          else if (cont === bank) bank.appendChild(chip);
          chip.removeEventListener("pointermove", move);
          chip.removeEventListener("pointerup", up);
          chip.removeEventListener("pointercancel", up);
        }
        chip.addEventListener("pointermove", move);
        chip.addEventListener("pointerup", up);
        chip.addEventListener("pointercancel", up);
      });
    }

    // fallback tap/clavier : bascule banque <-> zone
    function attachTap(chip) {
      function toggle() {
        if (locked) return;
        if (chip.parentNode === bank) zone.appendChild(chip);
        else bank.appendChild(chip);
      }
      chip.addEventListener("click", function (e) { if (!chip.classList.contains("is-dragging")) toggle(); });
      chip.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    }

    if (host.live) {
      shuffle(pool).forEach(function (txt) { bank.appendChild(makeChip(txt)); });
    } else {
      // vue resolue : bons elements dans la zone
      pool.forEach(function (txt) {
        var chip = makeChip(txt);
        if (corrects.indexOf(txt) !== -1) { chip.classList.add("is-correct"); zone.appendChild(chip); }
        else { chip.classList.add("is-muted"); bank.appendChild(chip); }
      });
    }

    var grid = el("div", { class: "dd-zones" }, [zone, bank]);
    wrap.appendChild(grid);

    var footSlot = el("div", { class: "dd-foot" });
    wrap.appendChild(footSlot);

    function inZone() {
      return Array.prototype.map.call(zone.querySelectorAll(".dd-chip"), function (n) { return n.dataset.text; });
    }

    function resolve() {
      if (locked) return;
      locked = true;
      var placed = inZone();
      var ok = sameSet(placed, corrects);
      Array.prototype.forEach.call(grid.querySelectorAll(".dd-chip"), function (n) {
        var isC = corrects.indexOf(n.dataset.text) !== -1;
        var isPlaced = n.parentNode === zone;
        if (isPlaced && isC) n.classList.add("is-correct");
        else if (isPlaced && !isC) n.classList.add("is-wrong");
        else if (!isPlaced && isC) n.classList.add("is-missed");
        else n.classList.add("is-muted");
        n.setAttribute("tabindex", "-1");
      });
      var html = "<p>" + App.escapeHtml(ok ? (data.feedback_reussi || "") : (data.feedback_erreurs || "")) + "</p>";
      footSlot.innerHTML = "";
      if (host.onResolved) host.onResolved(ok, html);
    }

    if (host.live) {
      footSlot.appendChild(el("button", {
        class: "btn btn--primary", attrs: { type: "button" }, on: { click: resolve }
      }, [
        el("span", { class: "btn__label", text: "Valider le triangle" }),
        el("span", { class: "btn__icon", html: App.icon("check") })
      ]));
    }

    return wrap;
  };

  /* ponytail self-check : la logique de comparaison qui decide du score. */
  (function () {
    try {
      var ok = arraysEqual([1, 2, 3], [1, 2, 3]) &&
        !arraysEqual([1, 2], [2, 1]) &&
        sameSet(["a", "b"], ["b", "a"]) &&
        !sameSet(["a"], ["a", "b"]);
      if (!ok && window.console) console.error("screen-dragdrop self-check FAILED");
    } catch (e) { /* ignore */ }
  })();

})(window);
