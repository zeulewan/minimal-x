import { writeFile, mkdir } from "fs/promises";
import selectors from "../content-scripts/src/selectors.js";

// Generate from the real registry so diagnostic selectors cannot drift separately.
const entries = Object.entries(selectors).flatMap(([name, value]) => typeof value === "string"
  ? [[name, value]]
  : Object.entries(value).map(([child, selector]) => [`${name}.${child}`, selector]));
const script = `/* Minimal X: read-only selector scan. Paste in X's developer console.
No requests, storage access, clicks, or post/account text collection.
A missing match means "not present on this page", not "obsolete".
*/
(() => {
  const selectors = ${JSON.stringify(entries, null, 2)};
  const results = selectors.map(([name, selector]) => {
    try {
      const nodes = [...document.querySelectorAll(selector)];
      const visible = nodes.filter(node => {
        const style = getComputedStyle(node);
        return node.getClientRects().length && style.visibility !== "hidden" && style.display !== "none";
      }).length;
      return { name, matches: nodes.length, visible, result: nodes.length ? "matched" : "not present on this page" };
    } catch (error) {
      return { name, result: "invalid selector", error: error.message };
    }
  });
  console.table(results);
  return results;
})();
`;
await mkdir(new URL("../diagnostics/", import.meta.url), { recursive: true });
await writeFile(new URL("../diagnostics/scan-x.js", import.meta.url), script);
console.log(`Generated read-only scan for ${entries.length} selectors: diagnostics/scan-x.js`);
