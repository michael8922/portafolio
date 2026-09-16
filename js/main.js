/*
  js/main.js
  ==========
  JavaScript del NAVEGADOR para el portafolio estático.

  Responsabilidades:
  - cambiar entre tema claro y oscuro;
  - persistir esa preferencia en localStorage;
  - insertar el año actual en el footer;
  - cerrar la navbar móvil después de elegir una sección.

  No existe aquí lógica de Express, PostgreSQL ni HelpDesk.
*/

// Clave utilizada para almacenar la preferencia de tema.
const THEME_STORAGE_KEY = "portfolio-theme";

/*
  Lee el valor de data-bs-theme del elemento <html>.

  Bootstrap 5.3 usa ese atributo para decidir su color mode.
*/
function getCurrentTheme() {
  // document.documentElement representa el elemento <html>.
  // Si el atributo no existe, usamos "light" como fallback.
  return document.documentElement.getAttribute("data-bs-theme") ?? "light";
}

/*
  Sincroniza el texto del botón con el tema actual.

  También actualiza aria-pressed para tecnologías de asistencia.
*/
function updateThemeButton(button) {
  if (!button) {
    return;
  }

  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === "dark";
  const actionLabel = isDark ? "Usar tema claro" : "Usar tema oscuro";
  const hiddenLabel = button.querySelector(".theme-label");

  if (hiddenLabel) {
    hiddenLabel.textContent = actionLabel;
  }

  button.setAttribute("aria-label", actionLabel);
  button.setAttribute("title", actionLabel);
  button.setAttribute("aria-pressed", String(isDark));
}
/*
  Inicializa el selector de tema:
  1. busca #themeToggle;
  2. ajusta su texto;
  3. escucha clicks;
  4. cambia data-bs-theme;
  5. guarda la elección en localStorage.
*/
function initializeThemeToggle() {
  // querySelector retorna el primer elemento que coincide con el selector.
  const button = document.querySelector("#themeToggle");

  if (!button) {
    return;
  }

  updateThemeButton(button);

  // addEventListener registra el comportamiento sin mezclarlo con el HTML.
  button.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", nextTheme);
    // Persistimos la preferencia para futuras visitas.
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch (error) { /* El tema funciona aunque el almacenamiento no esté disponible. */ }
    updateThemeButton(button);
  });
}

/*
  Busca todos los elementos con data-current-year e inserta el año actual.

  Así el footer no necesita actualizarse manualmente cada enero.
*/
function updateCurrentYear() {
  // querySelectorAll devuelve una colección de coincidencias.
  // forEach recorre cada una.
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

/*
  En móvil, Bootstrap puede dejar abierto el menú colapsable.
  Esta función lo cierra después de que el usuario selecciona un link.
*/
function closeMobileNavigationAfterSelection() {
  const navbar = document.querySelector(".navbar-collapse");

  // Si no existe navbar o Bootstrap JS no está cargado,
  // no intentamos usar su API.
  if (!navbar || typeof bootstrap === "undefined") {
    return;
  }

  navbar.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      // Recuperamos la instancia que Bootstrap ya creó para este collapse.
      const instance = bootstrap.Collapse.getInstance(navbar);

      if (instance) {
        instance.hide();
      }
    });
  });
}

// Punto de entrada del archivo: inicializamos las tres capacidades.
initializeThemeToggle();
updateCurrentYear();
closeMobileNavigationAfterSelection();
