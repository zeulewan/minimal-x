import { removeElementById } from "./removeElement";

export default function addStyles(id, css) {
  let style = document.getElementById("mt-style-" + id);
  if (!style) {
    style = document.createElement("style");
    style.id = "mt-style-" + id;
    document.head.insertBefore(style, document.getElementById("custom-css"));
  }
  const text = css.trim();
  if (style.textContent !== text) style.textContent = text;
}

export function removeStyles(id) {
  removeElementById("mt-style-" + id);
}

export function stylesExist(id) {
  return document.getElementById("mt-style-" + id);
}
