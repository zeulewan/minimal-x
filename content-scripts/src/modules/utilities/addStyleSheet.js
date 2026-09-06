export default function addStyleSheet(id, href, text) {
  const existing = document.getElementById(`mt-${id}-stylesheet`);
  if (existing) return existing;
  const head = document.querySelector("head");
  let stylesheet;

  if (href) {
    stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = href;
  } else if (text) {
    stylesheet = document.createElement("style");
    stylesheet.appendChild(document.createTextNode(text));
  }
  stylesheet.id = `mt-${id}-stylesheet`;
  head.insertBefore(stylesheet, document.getElementById("custom-css"));
  return stylesheet;
}
