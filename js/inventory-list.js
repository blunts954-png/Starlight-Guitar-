(function () {
  var mountIds = ["gear-mount", "home-inventory-mount", "inventory-mount", "heavy-hitters-mount"];
  var mounts = [];
  mountIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) mounts.push(el);
  });
  if (!mounts.length) return;

  function esc(s) {
    if (s == null) return "";
    var d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }

  function formatPrice(n) {
    var x = Number(n);
    if (isNaN(x)) return "";
    var cents = Math.round(x * 100) % 100 !== 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: cents ? 2 : 0,
      maximumFractionDigits: 2
    }).format(x);
  }

  function inGearFolder() {
    var p = window.location.pathname || "";
    return /\/gear\//i.test(p) || /\/gear$/i.test(p);
  }

  function resolvePageHref(it) {
    if (it.page) {
      var p = it.page;
      if (inGearFolder() && p.indexOf("gear/") === 0) {
        return p.replace(/^gear\//, "");
      }
      return p;
    }
    return it.externalUrl || "https://www.skylightguitars.com/store";
  }

  function resolveAssetUrl(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (inGearFolder()) {
      return url.indexOf("../") === 0 ? url : "../" + url.replace(/^\//, "");
    }
    return url.replace(/^\//, "");
  }

  function firstVibeTag(vibe) {
    if (!vibe) return "";
    return (vibe.indexOf("·") >= 0 ? vibe.split("·")[0] : vibe).trim();
  }

  function filterItems(items, root) {
    var out = items.slice();
    var filter = root.getAttribute("data-filter") || "";
    if (filter === "essential") {
      out = out.filter(function (i) {
        return i.essential === true;
      });
      out.sort(function (a, b) {
        return (a.essentialRank || 999) - (b.essentialRank || 999);
      });
    }
    var limit = parseInt(root.getAttribute("data-limit"), 10);
    if (!isNaN(limit) && limit > 0) {
      out = out.slice(0, limit);
    }
    return out;
  }

  function renderCard(it) {
    var href = resolvePageHref(it);
    var isInternal = !!it.page;
    var imgSrc = resolveAssetUrl(it.heroImage);
    var imgBlock = imgSrc
      ? '<img src="' +
        esc(imgSrc) +
        '" alt="' +
        esc(it.shortTitle || it.title) +
        '" loading="lazy" width="600" height="750" />'
      : '<div class="card-guitar__ph"><span>' +
        esc((it.shortTitle || it.title || "?").charAt(0)) +
        "</span></div>";

    return (
      '<article class="card-guitar card-guitar--vault">' +
      '<a class="card-guitar__link" href="' +
      esc(href) +
      '"' +
      (isInternal ? "" : ' rel="noopener noreferrer"') +
      ">" +
      '<div class="card-guitar__img">' +
      imgBlock +
      '<span class="card-guitar__shine" aria-hidden="true"></span>' +
      "</div>" +
      '<div class="card-guitar__body">' +
      "<h3>" +
      esc(it.shortTitle || it.title) +
      "</h3>" +
      '<div class="tags">' +
      '<span class="tag">' +
      esc(it.year || "—") +
      "</span>" +
      '<span class="tag">' +
      esc(it.origin || "—") +
      "</span>" +
      '<span class="tag">' +
      esc(firstVibeTag(it.vibe) || "Skylight") +
      "</span>" +
      "</div>" +
      '<p class="card-guitar__price">' +
      formatPrice(it.price) +
      "</p>" +
      '<p class="card-guitar__excerpt">' +
      esc(it.blurb || "") +
      "</p>" +
      '<span class="card-guitar__cta">' +
      (isInternal ? "Open listing →" : "View on store →") +
      "</span>" +
      "</div>" +
      "</a>" +
      "</article>"
    );
  }

  function renderInto(root, items) {
    if (!items.length) {
      root.innerHTML =
        '<p class="gear-empty">No pieces match this view. Visit the <a href="https://www.skylightguitars.com/store">Skylight store</a>.</p>';
      return;
    }
    root.innerHTML = '<div class="gallery-grid gallery-grid--dense">' + items.map(renderCard).join("") + "</div>";
  }

  function run(data) {
    var items = data.items || [];
    mounts.forEach(function (root) {
      renderInto(root, filterItems(items, root));
    });
  }

  var invPath = document.documentElement.getAttribute("data-inventory") || "data/inventory.json";
  fetch(invPath, { credentials: "same-origin" })
    .then(function (r) {
      return r.json();
    })
    .then(run)
    .catch(function () {
      mounts.forEach(function (root) {
        root.innerHTML =
          '<p class="gear-empty">Serve over HTTP to load inventory (e.g. <code>python -m http.server</code>) or visit the <a href="https://www.skylightguitars.com/store">live store</a>.</p>';
      });
    });
})();
