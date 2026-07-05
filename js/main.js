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
  navToggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("is-open"))
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
