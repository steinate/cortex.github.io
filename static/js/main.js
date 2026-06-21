(function () {
  "use strict";

  if (window.lucide) {
    window.lucide.createIcons();
  }

  var nav = document.querySelector(".nav");
  var bar = document.querySelector(".progress-bar");

  function updateScrollState() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (nav) nav.classList.toggle("is-scrolled", y > 6);
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }

  document.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  var themeButton = document.getElementById("theme-toggle");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("cortex-theme", next); } catch (_) {}
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImage = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector(".lightbox-caption");
    var closeButton = lightbox.querySelector(".lightbox-close");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lightboxImage) lightboxImage.src = "";
    }

    document.querySelectorAll("[data-zoom]").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || "";
        lightboxCaption.textContent = img.alt || "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    if (closeButton) closeButton.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });
  }

  var copyButton = document.querySelector(".copy-btn");
  if (copyButton) {
    var originalText = copyButton.innerHTML;
    copyButton.addEventListener("click", function () {
      var source = document.getElementById("bibtex-text");
      if (!source) return;
      navigator.clipboard.writeText(source.innerText).then(function () {
        copyButton.textContent = "Copied";
        window.setTimeout(function () {
          copyButton.innerHTML = originalText;
          if (window.lucide) window.lucide.createIcons();
        }, 1400);
      }).catch(function () {
        copyButton.textContent = "Copy failed";
        window.setTimeout(function () {
          copyButton.innerHTML = originalText;
          if (window.lucide) window.lucide.createIcons();
        }, 1400);
      });
    });
  }
})();
