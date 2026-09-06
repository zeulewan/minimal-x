const owned = (node) => {
  const element = node?.nodeType === 1 ? node : node?.parentElement;
  return !!element?.closest('[id^="mt-"], [id^="typefully-"], #custom-css');
};

const skippableNode = (node) => {
  if (owned(node)) return true;
  // Text changes and media internals do not introduce new feature targets.
  return node?.nodeType === 3 || ["IMG", "VIDEO", "SCRIPT", "STYLE", "path"].includes(node?.nodeName);
};

export default function isMutationSkippable(mutations) {
  return Array.from(mutations).every((mutation) => {
    if (owned(mutation.target) || mutation.target?.closest?.("head")) return true;
    const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
    return nodes.length > 0 && nodes.every(skippableNode);
  });
}
