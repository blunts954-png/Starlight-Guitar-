(function () {
  var splash = document.getElementById("splash");
  if (!splash) return;

  var root = document.documentElement;
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    root.classList.remove("is-splash-active");
    root.classList.add("is-splash-done");
    splash.setAttribute("aria-hidden", "true");
    if (splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }

  root.classList.add("is-splash-active");

  splash.addEventListener("click", finish);
  splash.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      finish();
    }
  });

  window.setTimeout(finish, 3200);
})();
