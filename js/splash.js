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

  if (window.sessionStorage && sessionStorage.getItem("skylightSplashSeen") === "1") {
    finish();
    return;
  }

  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ""))) {
    finish();
    return;
  }

  root.classList.add("is-splash-active");

  splash.addEventListener("click", function () {
    if (window.sessionStorage) sessionStorage.setItem("skylightSplashSeen", "1");
    finish();
  });
  splash.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (window.sessionStorage) sessionStorage.setItem("skylightSplashSeen", "1");
      finish();
    }
  });

  var isSmallScreen = window.matchMedia("(max-width: 900px)").matches;
  window.setTimeout(function () {
    if (window.sessionStorage) sessionStorage.setItem("skylightSplashSeen", "1");
    finish();
  }, isSmallScreen ? 1800 : 2400);
})();
