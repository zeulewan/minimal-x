import { isHomePage, isComposePage } from "../utilities/routes";
import { KeyRecentMedia } from "../../../../storage-keys";
import selectors from "../../selectors";
import addStyles, { removeStyles, stylesExist } from "../utilities/addStyles";
import { getStorage } from "../utilities/storage";

export const changeTimelineWidth = (width) => {
  if (![600, 650, 700, 750, 800].includes(width)) return;
  addStyles("timelineWidth", `
    @media only screen and (min-width: 988px) {
      ${selectors.mainColumn} { width: ${width}px; max-width: ${width}px; }
    }
  `);
};

export const changeTimelineBorders = (timelineBorders) => {
  switch (timelineBorders) {
    case "off":
      removeStyles("timelineBorders");
      break;

    case "on":
      addStyles(
        "timelineBorders",
        `
        @media only screen and (min-width: 988px) {
          div${selectors.mainColumn} {
            border-style: hidden;
          }
        }
        `.trim()
      );
      break;
  }
};

export const changeTweetBorders = (tweetBorders) => {
  switch (tweetBorders) {
    case "off":
      removeStyles("tweetBorders");
      break;

    case "on":
      addStyles(
        "tweetBorders",
        `
        ${selectors.mainWrapper} section > div > div > div > div[role="separator"] {
          display: none;
        }
        ${selectors.mainColumn} > div > div:empty {
          background: transparent;
        }
        `.trim()
      );
      break;
  }
};

export const changeStickyHeader = (stickyHeader) => {
  switch (stickyHeader) {
    case "on":
      removeStyles("stickyHeader");
      break;

    case "off":
      addStyles(
        "stickyHeader",
        `
        ${selectors.mainColumn} > div > div {
          position: unset;
        }
        `
      );
      break;
  }
};

export const changePromotedPosts = (removePromotedPosts) => {
  switch (removePromotedPosts) {
    case "off":
      addStyles(
        "removePromotedPosts",
        `
        [data-testid="placementTracking"] article {
          display: flex;
        }
        `
      );
      break;

    case "on":
      removeStyles("removePromotedPosts");
      break;
  }
};

export const changeTopicsToFollow = (removeTopicsToFollow) => {
  switch (removeTopicsToFollow) {
    case "off":
      removeStyles("removeTopicsToFollow");
      break;

    case "on":
      addStyles(
        "removeTopicsToFollow",
        `
        ${selectors.mainColumn} section[aria-labelledby^="accessible-list-"] > div[aria-label$="Carousel"],
        ${selectors.mainColumn} a[href*="/i/flow/topics_selector"],
        ${selectors.mainColumn} a[href*="/i/topics/picker/home"] {
          display: none;
        }
        [aria-label="Lists timeline"] section[aria-labelledby^="accessible-list-"] > div[aria-label$="Carousel"] {
          display: flex;
        }
        `
      );
      break;
  }
};

export const changeTimelineTabs = (removeTimelineTabs) => {
  if (isComposePage() || !isHomePage()) {
    removeStyles("removeTimelineTabs");
    return;
  }

  switch (removeTimelineTabs) {
    case "off":
      removeStyles("removeTimelineTabs");
      break;

    case "on":
      if (stylesExist("removeTimelineTabs")) return;

      addStyles(
        "removeTimelineTabs",
        `
        ${selectors.timelineTabs} {
          display: none;
        }
        `
      );
      break;
  }
};

export const changeRecentMedia = async (recentMedia) => {
  const userProfile = document.querySelector('meta[content*="twitter://user?screen_name="]');

  if (!userProfile) {
    removeStyles("recentMedia");
    return;
  }

  const sidebarPhotoGrid = document
    .querySelector(selectors.rightSidebar)
    ?.querySelector('[aria-label][tabindex="0"]')
    ?.querySelector('[style="padding-bottom: 56.25%;"]')?.parentElement;

  if (!sidebarPhotoGrid) return;

  const run = (rm) => {
    switch (rm) {
      case "off":
        removeStyles("recentMedia");
        sidebarPhotoGrid.classList.remove("mt-recentMedia-photoGrid");
        break;

      case "on":
        addStyles(
          "recentMedia",
          `
            @media only screen and (min-width: 1265px) {
              .mt-recentMedia-photoGrid {
                visibility: visible;
                position: fixed;
                right: 16px;
                top: 70px;
                width: 300px;
              }
              
              [data-testid="primaryColumn"] {
                transform: translateX(-64px);
              }
            }
            `
        );
        sidebarPhotoGrid.classList.add("mt-recentMedia-photoGrid");

        break;
    }
  };

  if (recentMedia) {
    run(recentMedia);
  } else {
    const setting = await getStorage(KeyRecentMedia);
    run(setting);
  }
};

export const changeTrendsHomeTimeline = (trendsHomeTimeline) => {
  if (isComposePage() || !isHomePage()) {
    removeStyles("trendsHomeTimeline");
    return;
  }

  switch (trendsHomeTimeline) {
    case "off":
      removeStyles("trendsHomeTimeline");
      break;

    case "on":
      if (stylesExist("trendsHomeTimeline")) return;

      addStyles(
        "trendsHomeTimeline",
        `
          @keyframes render {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          @media only screen and (min-width: 1265px) {
            ${selectors.rightSidebar} section[aria-labelledby^="accessible-list-"] {
              visibility: visible;
              position: fixed;
              right: 16px;
              top: 66px;
              max-height: 78vh;
              overflow: auto;
              width: 300px;
              border-radius: 16px;
              border-color: var(--border-color);
              border-width: 1px;
              background-color: var(--body-bg-color);
              opacity: 0;
              will-change: opacity;
              animation-name: render;
              animation-duration: 0s;
              animation-fill-mode: forwards;
              animation-delay: 500ms;
              margin-top: 4px;
            }

            [data-testid="primaryColumn"] {
              transform: translateX(-64px);
            }
          }
          `
      );
      break;
  }
};

// Never infer a timeline's identity from its position: pinned lists and X's
// timeline customization can move Following to the first tab.
export const changeFollowingTimeline = (followingTimeline) => {
  if (followingTimeline !== "on" || !isHomePage()) return;
  const tabs = Array.from(document.querySelectorAll(`${selectors.homeTimelineTablist} [role="tab"]`));
  const following = tabs.find((tab) => {
    const link = tab.matches("a[href]") ? tab : tab.querySelector("a[href]");
    if (link) {
      const url = new URL(link.href, window.location.origin);
      if (url.pathname === "/home" && ["live", "following"].includes(url.searchParams.get("f"))) return true;
    }
    return tab.textContent.trim().toLocaleLowerCase() === "following";
  });
  if (following && following.getAttribute("aria-selected") !== "true") following.click();
};

let grokDocument;
let grokObserver;
let observedGrokHeader;
let pendingGrokOpen = false;
const enableGrokDrawer = () => {
  const drawer = document.querySelector(selectors.grokDrawer);
  if (drawer) {
    drawer.classList.add("mt-grok-drawer-enabled");
    pendingGrokOpen = false;
  }
};
const onGrokClick = (event) => {
  const button = event.target.closest?.("button");
  if (!button?.querySelector(selectors.grokSvg)) return;
  pendingGrokOpen = true;
  enableGrokDrawer();
};

export const enableGrokDrawerOnGrokButtonClick = (setting) => {
  if (setting === undefined) return;
  if (setting !== "on" || grokDocument !== document) {
    grokDocument?.removeEventListener("click", onGrokClick, true);
    grokDocument = undefined;
    grokObserver?.disconnect();
    grokObserver = undefined;
    observedGrokHeader = undefined;
    pendingGrokOpen = false;
  }
  if (setting !== "on") return;
  if (!grokDocument) {
    grokDocument = document;
    document.addEventListener("click", onGrokClick, true);
  }
  if (pendingGrokOpen) enableGrokDrawer();
  const header = document.querySelector(selectors.grokDrawerHeader);
  if (header === observedGrokHeader) return;
  grokObserver?.disconnect();
  observedGrokHeader = header;
  if (!header || typeof ResizeObserver === "undefined") return;
  grokObserver = new ResizeObserver(([entry]) => {
    if (entry.target.children.length === 1 && entry.target.firstElementChild.tagName === "BUTTON") {
      document.querySelector(selectors.grokDrawer)?.classList.remove("mt-grok-drawer-enabled");
    }
  });
  grokObserver.observe(header);
};

// Restrict hiding to identified Home tabs, even when users reorder their feeds.
export const changeHideForYouTimeline = (setting) => {
  document.querySelectorAll(".mt-for-you-tab").forEach(node => node.classList.remove("mt-for-you-tab"));
  if (setting !== "on" || !isHomePage()) {
    removeStyles("hideForYouTimeline");
    return;
  }
  changeFollowingTimeline("on");
  document.querySelectorAll(`${selectors.homeTimelineTablist} [role="tab"]`).forEach(tab => {
    const link = tab.matches("a[href]") ? tab : tab.querySelector("a[href]");
    const url = link ? new URL(link.href, window.location.origin) : null;
    const forYou = tab.textContent.trim().toLocaleLowerCase() === "for you" ||
      (url?.pathname === "/home" && ["for_you", "foryou"].includes(url.searchParams.get("f")));
    if (forYou) (tab.closest('[role="presentation"]') || tab).classList.add("mt-for-you-tab");
  });
  addStyles("hideForYouTimeline", `${selectors.homeTimelineTablist} .mt-for-you-tab { display: none; }`);
};
