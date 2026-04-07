(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var panel = document.getElementById("nav-panel");

  function closeNav() {
    if (!header) return;
    header.classList.remove("is-nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-nav-open");
  }

  function openNav() {
    if (!header) return;
    header.classList.add("is-nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-nav-open");
  }

  if (toggle && header) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (header.classList.contains("is-nav-open")) closeNav();
      else openNav();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  document.addEventListener("click", function (e) {
    if (!header || !header.classList.contains("is-nav-open")) return;
    if (!header.contains(e.target)) closeNav();
  });

  document.querySelectorAll(".nav-panel a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 900px)").matches) closeNav();
    });
  });

  if (header) {
    function onScroll() {
      if (window.scrollY > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var rawPath = (window.location.pathname || "").replace(/\\/g, "/");
  var segments = rawPath.split("/").filter(Boolean);
  var path = segments.length ? segments[segments.length - 1] : "";
  if (!path || path === "/") path = "index.html";
  if (!/\.[a-z0-9]+$/i.test(path)) path = "index.html";
  document.querySelectorAll(".nav-main a[href]").forEach(function (a) {
    var h = (a.getAttribute("href") || "").split("#")[0].split("?")[0];
    var base = h.split("/").filter(Boolean).pop() || "";
    if (base === path || (path === "index.html" && (base === "index.html" || h === "" || h === "./"))) {
      a.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id.length < 2) return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  var rt = document.getElementById("repair-type-toggle");
  var rp = document.getElementById("repair-type-panel");
  if (rt && rp) {
    rt.addEventListener("click", function () {
      var open = rp.classList.toggle("is-open");
      rt.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
