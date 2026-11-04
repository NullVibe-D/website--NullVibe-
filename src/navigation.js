export function enhanceNavigation() {
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return;
  const toggle = menu.querySelector("summary");
  document.addEventListener("keydown", (event) => {
    if (menu.open && event.key === "Escape") {
      menu.open = false;
      toggle.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget))
      menu.open = false;
  });
  window.addEventListener("pageshow", () => {
    menu.open = false;
  });
  matchMedia("(min-width: 901px)").addEventListener("change", () => {
    menu.open = false;
  });
}
