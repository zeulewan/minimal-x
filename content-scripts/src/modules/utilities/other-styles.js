import selectors from "../../selectors";
import addStyles, { removeStyles } from "./addStyles";

let searchDocument;
const expandSearch = () => addStyles("sidebarSearchWidth", `${selectors.searchBox} { width: 374px; }`);
const onSearchFocus = (event) => {
  if (event.target.closest?.(selectors.searchBox)) expandSearch();
};
const onSearchClick = (event) => {
  if (!event.target.closest?.(selectors.searchBox)) removeStyles("sidebarSearchWidth");
  else if (event.target.closest?.('[role="listbox"]')) expandSearch();
};

export const addSmallerSearchBarStyle = () => {
  if (searchDocument !== document) {
    searchDocument?.removeEventListener("focusin", onSearchFocus, true);
    searchDocument?.removeEventListener("click", onSearchClick, true);
    searchDocument = document;
    document.addEventListener("focusin", onSearchFocus, true);
    document.addEventListener("click", onSearchClick, true);
  }
  const input = document.querySelector(selectors.searchBoxInput);
  if (!input || /^\/(search|explore)(?:\/|$)/.test(window.location.pathname)) {
    removeStyles("searchInputWidth");
    removeStyles("sidebarSearchWidth");
    return;
  }
  if (document.activeElement !== input) {
    const width = (input.getAttribute("placeholder") || "Search").length + 4;
    addStyles("searchInputWidth", `${selectors.searchBoxInput} { width: ${width}ch; }`);
  }
  if (document.querySelector(selectors.searchListBox)) expandSearch();
};
