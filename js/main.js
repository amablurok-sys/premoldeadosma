const WHATSAPP_NUMBER = "5491141449010";

function buildWaLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-wa-message]").forEach((el) => {
  el.href = buildWaLink(el.getAttribute("data-wa-message"));
});

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.setAttribute("aria-expanded", "false");
  const setNav = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };
  navToggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setNav(false))
  );
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("fNombre").value.trim();
    const telefono = document.getElementById("fTelefono").value.trim();
    const modelo = document.getElementById("fModelo").value;
    const metros = document.getElementById("fMetros").value.trim();
    const mensaje = document.getElementById("fMensaje").value.trim();

    let text = `Hola! Quiero pedir una cotización.\n`;
    text += `Nombre: ${nombre}\n`;
    text += `Teléfono: ${telefono}\n`;
    text += `Modelo de interés: ${modelo}\n`;
    if (metros) text += `Metros lineales aprox: ${metros}\n`;
    if (mensaje) text += `Mensaje: ${mensaje}`;

    window.open(buildWaLink(text), "_blank");
  });
}

/* ---- Animaciones al hacer scroll (reveal) + conteo de stats ---- */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Marca que hay JS: recién ahí el CSS oculta los .reveal. Sin JS se ve todo normal.
document.documentElement.classList.add("js");

// Marcar bloques a revelar (a nivel contenedor para no interferir con hovers)
const revealSelectors = [
  ".about", ".process-grid", ".product-grid", ".gallery-grid",
  ".testimonial-grid", ".payment-grid", ".contact", ".section__title"
];
document.querySelectorAll(revealSelectors.join(",")).forEach((el) => el.classList.add("reveal"));

const animateCount = (el) => {
  const target = parseFloat(el.getAttribute("data-count"));
  const suffix = el.getAttribute("data-suffix") || "";
  if (isNaN(target)) return;
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const revealEls = document.querySelectorAll(".reveal");
if (prefersReduced || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => observer.observe(el));

  // Red de seguridad: si algo falla, revelar todo tras 3s para nunca dejar contenido oculto.
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      el.classList.add("is-visible");
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  }, 3000);
}

/* ---- Lightbox de galería ---- */
const lightbox = document.getElementById("lightbox");
const galleryLinks = Array.from(document.querySelectorAll(".gallery-grid a"));
if (lightbox && galleryLinks.length) {
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const btnClose = document.getElementById("lightboxClose");
  const btnPrev = document.getElementById("lightboxPrev");
  const btnNext = document.getElementById("lightboxNext");
  const items = galleryLinks.map((a) => ({
    src: a.getAttribute("href"),
    caption: (a.querySelector("img") && a.querySelector("img").alt) || ""
  }));
  let current = 0;
  let lastFocused = null;

  const render = () => {
    const it = items[current];
    lbImg.src = it.src;
    lbImg.alt = it.caption;
    lbCaption.textContent = it.caption;
  };
  const openAt = (i) => {
    current = i;
    lastFocused = document.activeElement;
    render();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    btnClose.focus();
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  };
  const go = (dir) => { current = (current + dir + items.length) % items.length; render(); };

  galleryLinks.forEach((a, i) =>
    a.addEventListener("click", (e) => { e.preventDefault(); openAt(i); })
  );
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  });
}
