export const changeCustomCss = (cssText) => {
  if (typeof cssText !== "string") return;
  let style = document.getElementById("custom-css");
  if (!style) {
    style = document.createElement("style");
    style.id = "custom-css";
    document.head.appendChild(style);
  }
  if (style.textContent !== cssText) style.textContent = cssText;
};
