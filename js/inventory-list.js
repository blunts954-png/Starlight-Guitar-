(function () {
  var root = document.getElementById("gear-mount");
  if (!root) return;

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatPrice(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  }

  function render(items) {
    if (!items.length) {
      root.innerHTML =
        '<p class="gear-empty">No pieces in the vault yet. Check the <a href="https://www.skylightguitars.com/store">Squarespace store</a> or add entries to <code>data/inventory.json</code>.</p>';
      return;
    }
    var html =
      '<div class="gallery-grid">' +
      items
        .map(function (it) {
          return (
            '<article class="card-guitar card-guitar--vault">' +
            '<a class="card-guitar__link" href="' +
            esc(it.page) +
            '">' +
            '<div class="card-guitar__img">' +
            '<img src="' +
            esc(it.heroImage) +
            '" alt="' +
            esc(it.shortTitle || it.title) +
            '" loading="lazy" width="600" height="750" />' +
            '<span class="card-guitar__shine" aria-hidden="true"></span>' +
            "</div>" +
            '<div class="card-guitar__body">' +
            "<h3>" +
            esc(it.shortTitle || it.title) +
            "</h3>" +
            '<div class="tags">' +
            '<span class="tag">' +
            esc(it.year) +
            "</span>" +
            '<span class="tag">' +
            esc(it.origin) +
            "</span>" +
            '<span class="tag">' +
            esc((it.vibe.indexOf("·") >= 0 ? it.vibe.split("·")[0] : it.vibe).trim()) +
            "</span>" +
            "</div>" +
            '<p class="card-guitar__price">' +
            formatPrice(it.price) +
            "</p>" +
            '<p class="card-guitar__excerpt">' +
            esc(it.blurb) +
            "</p>" +
            '<span class="card-guitar__cta">Open listing →</span>' +
            "</div>" +
            "</a>" +
            "</article>"
          );
        })
        .join("") +
      "</div>";
    root.innerHTML = html;
  }

  function run(data) {
    render(data.items || []);
  }

  var invPath = document.documentElement.getAttribute("data-inventory") || "data/inventory.json";
  fetch(invPath, { credentials: "same-origin" })
    .then(function (r) {
      return r.json();
    })
    .then(run)
    .catch(function () {
      root.innerHTML =
        '<p class="gear-empty">Open this site over HTTP (e.g. <code>python -m http.server</code> from the project folder) so the vault can load <code>data/inventory.json</code>. Or visit the <a href="https://www.skylightguitars.com/store">live Skylight store</a>.</p>';
    });
})();
