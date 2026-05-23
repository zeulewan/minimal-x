import { removeElementById } from "./removeElement";

export default function addStyles(id, css) {
  const styleId = "mt-style-" + id;
  const styleText = css.trim().split("\n").join("");
  const existingStyle = document.getElementById(styleId);

  if (existingStyle?.textContent === styleText) {
    return;
  }

  removeElementById(styleId);

  const head = document.querySelector("head");
  if (!head) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = styleText;
  head.appendChild(style);
}

export function removeStyles(id) {
  removeElementById("mt-style-" + id);
}

export function stylesExist(id) {
  return document.getElementById("mt-style-" + id);
}
