/* ==========================================================================
   screen-association.js — relier des paires (gauche -> droite)
   Expose : App.buildAssociation(data, host)

   - Colonne gauche cliquable (personnes, photo optionnelle avec fallback),
     colonne droite cliquable (roles).
   - Clic gauche puis clic droite => liaison. Recliquer une gauche liee la delie.
   - Lignes dessinees dans un <svg> overlay (regle 5 du brief), recalcule au
     resize. Plusieurs gauches peuvent pointer vers la meme droite.

   host = { live, onResolved: fn(correct, feedbackHTML) } ; renvoie un noeud.
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});
  var el = App.el;
  var SVGNS = "http://www.w3.org/2000/svg";

  function slug(name) {
    var s = name.toLowerCase();
    if (s.normalize) s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); // retire les accents
    return s.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  }

  function feedbackHTML(ok, data, correct, left) {
    var html = "<p>" + App.escapeHtml(ok ? (data.feedback_si_reussi || "") : (data.feedback_si_erreurs || "")) + "</p>";
    if (!ok) {
      html += '<p class="retain"><span class="retain__tag">Les bonnes paires</span>' +
        left.map(function (l) { return App.escapeHtml(l) + " → " + App.escapeHtml(correct[l]); }).join("<br>") + "</p>";
    }
    return html;
  }

  App.buildAssociation = function (data, host) {
    host = host || {};
    var left = (data.elements_gauche || []).slice();
    var right = (data.elements_droite || []).slice();
    var correct = data.associations_correctes || {};
    var locked = !host.live;

    var links = {}; // leftIndex -> rightIndex
    var selectedLeft = null;

    var wrap = el("div", { class: "assoc-wrap" });
    if (data.consigne) wrap.appendChild(el("p", { class: "instruction", text: data.consigne }));

    var board = el("div", { class: "assoc" });
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "assoc-svg");
    svg.setAttribute("aria-hidden", "true");
    board.appendChild(svg);

    var colL = el("div", { class: "assoc-col assoc-col--left" });
    var colR = el("div", { class: "assoc-col assoc-col--right" });
    var leftNodes = [], rightNodes = [];

    left.forEach(function (name, i) {
      var photo = el("img", {
        class: "assoc-item__photo",
        attrs: { src: "assets/" + slug(name) + ".jpg", alt: "", loading: "lazy" },
        on: { error: function (e) { e.target.style.display = "none"; } }
      });
      var node = el("button", {
        class: "assoc-item assoc-item--left",
        attrs: { type: "button", "aria-pressed": "false" },
        dataset: { i: i },
        on: { click: function () { pickLeft(i); } }
      }, [
        photo,
        el("span", { class: "assoc-item__label", text: name }),
        el("span", { class: "assoc-item__plug" })
      ]);
      leftNodes.push(node);
      colL.appendChild(node);
    });

    right.forEach(function (role, j) {
      var node = el("button", {
        class: "assoc-item assoc-item--right",
        attrs: { type: "button" },
        dataset: { j: j },
        on: { click: function () { pickRight(j); } }
      }, [
        el("span", { class: "assoc-item__plug" }),
        el("span", { class: "assoc-item__label", text: role })
      ]);
      rightNodes.push(node);
      colR.appendChild(node);
    });

    board.appendChild(colL);
    board.appendChild(colR);
    wrap.appendChild(board);

    var footSlot = el("div", { class: "assoc-foot" });
    wrap.appendChild(footSlot);

    /* -------- interactions -------- */
    function clearSelection() {
      selectedLeft = null;
      leftNodes.forEach(function (n) { n.classList.remove("is-selected"); n.setAttribute("aria-pressed", "false"); });
    }

    function pickLeft(i) {
      if (locked) return;
      if (links[i] != null) { // delier
        delete links[i];
        draw();
      }
      if (selectedLeft === i) { clearSelection(); return; }
      clearSelection();
      selectedLeft = i;
      leftNodes[i].classList.add("is-selected");
      leftNodes[i].setAttribute("aria-pressed", "true");
    }

    function pickRight(j) {
      if (locked) return;
      if (selectedLeft == null) return;
      links[selectedLeft] = j;
      clearSelection();
      draw();
    }

    /* -------- lignes SVG -------- */
    function center(node, side) {
      var b = node.getBoundingClientRect();
      var o = board.getBoundingClientRect();
      return {
        x: (side === "right" ? b.right : b.left) - o.left,
        y: b.top + b.height / 2 - o.top
      };
    }

    function draw(result) {
      var o = board.getBoundingClientRect();
      svg.setAttribute("width", o.width);
      svg.setAttribute("height", o.height);
      svg.setAttribute("viewBox", "0 0 " + o.width + " " + o.height);
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      Object.keys(links).forEach(function (key) {
        var i = +key, j = links[key];
        if (j == null) return;
        var p1 = center(leftNodes[i], "right");
        var p2 = center(rightNodes[j], "left");
        var line = document.createElementNS(SVGNS, "path");
        var dx = (p2.x - p1.x) * 0.45;
        line.setAttribute("d", "M" + p1.x + "," + p1.y + " C" + (p1.x + dx) + "," + p1.y + " " + (p2.x - dx) + "," + p2.y + " " + p2.x + "," + p2.y);
        line.setAttribute("fill", "none");
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-linecap", "round");
        var cls = "assoc-line";
        if (result) cls += (right[j] === correct[left[i]]) ? " assoc-line--correct" : " assoc-line--error";
        line.setAttribute("class", cls);
        svg.appendChild(line);
      });
    }

    function redraw() { draw(board.dataset.resolved ? true : null); }
    window.addEventListener("resize", redraw);

    /* -------- validation -------- */
    function resolve() {
      if (locked) return;
      // toutes les gauches doivent etre reliees
      var allLinked = left.every(function (_, i) { return links[i] != null; });
      var ok = allLinked && left.every(function (name, i) { return right[links[i]] === correct[name]; });
      locked = true;
      board.dataset.resolved = "1";
      leftNodes.forEach(function (n, i) {
        n.classList.add(right[links[i]] === correct[left[i]] ? "is-correct" : "is-wrong");
      });
      draw(true);
      footSlot.innerHTML = "";
      if (host.onResolved) host.onResolved(ok, feedbackHTML(ok, data, correct, left));
    }

    if (host.live) {
      footSlot.appendChild(el("button", {
        class: "btn btn--primary", attrs: { type: "button" }, on: { click: resolve }
      }, [
        el("span", { class: "btn__label", text: "Valider les associations" }),
        el("span", { class: "btn__icon", html: App.icon("check") })
      ]));
    } else {
      // vue resolue : liaisons canoniques
      left.forEach(function (name, i) {
        var j = right.indexOf(correct[name]);
        if (j !== -1) { links[i] = j; leftNodes[i].classList.add("is-correct"); }
      });
      board.dataset.resolved = "1";
    }

    // dessin initial differe (apres mise en page + animation d'entree)
    requestAnimationFrame(function () { draw(board.dataset.resolved ? true : null); });
    window.setTimeout(function () { draw(board.dataset.resolved ? true : null); }, 420);

    return wrap;
  };

})(window);
