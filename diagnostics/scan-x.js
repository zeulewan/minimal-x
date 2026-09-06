/* Minimal X: read-only selector scan. Paste in X's developer console.
No requests, storage access, clicks, or post/account text collection.
A missing match means "not present on this page", not "obsolete".
*/
(() => {
  const selectors = [
  [
    "homeTimelineTablist",
    "[data-testid=\"primaryColumn\"] [data-testid=\"ScrollSnap-List\"][role=\"tablist\"]"
  ],
  [
    "mainWrapper",
    "main[role=\"main\"]"
  ],
  [
    "mainColumn",
    "[data-testid=\"primaryColumn\"]"
  ],
  [
    "topHeader",
    "[data-testid=\"primaryColumn\"] > div > div:nth-of-type(1)"
  ],
  [
    "timelineTabs",
    "[data-testid=\"primaryColumn\"] > div:first-child > div:first-child > div:first-child > div:only-child > nav:only-child"
  ],
  [
    "leftSidebar",
    "header[role=\"banner\"]"
  ],
  [
    "leftSidebarLinks",
    "header[role=\"banner\"] nav[role=\"navigation\"]"
  ],
  [
    "leftSidebarUnreadBadge",
    "header[role=\"banner\"] nav[role=\"navigation\"] a svg + div[aria-label]:only-of-type"
  ],
  [
    "sidebarLinks.logo",
    "header[role=\"banner\"] div:first-child > div:first-child div:first-child > div:first-child > h1:only-child[role=\"heading\"]"
  ],
  [
    "sidebarLinks.home",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Home_Link\"]"
  ],
  [
    "sidebarLinks.explore",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Explore_Link\"]"
  ],
  [
    "sidebarLinks.notifications",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Notifications_Link\"]"
  ],
  [
    "sidebarLinks.messages",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_DirectMessage_Link\"]"
  ],
  [
    "sidebarLinks.following",
    "header[role=\"banner\"] [data-testid*=\"Following\"], header[role=\"banner\"] [aria-label=\"Following\"][role=\"link\"], header[role=\"banner\"] [aria-label=\"Follow\"][role=\"link\"], header[role=\"banner\"] a[href=\"/i/following\"], header[role=\"banner\"] a[href*=\"/following\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.bookmarks",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Bookmarks_Link\"], header[role=\"banner\"] a[href*=\"bookmarks\"]"
  ],
  [
    "sidebarLinks.more",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_More_Menu\"], header[role=\"banner\"] [aria-label=\"More\"][role=\"button\"], header[role=\"banner\"] [aria-label=\"More menu items\"][role=\"button\"]"
  ],
  [
    "sidebarLinks.creatorStudio",
    "header[role=\"banner\"] [data-testid*=\"Creator\"], header[role=\"banner\"] a[href*=\"/i/jf/creators/studio\"][role=\"link\"][aria-label], header[role=\"banner\"] a[href*=\"creator\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.jobs",
    "header[role=\"banner\"] [data-testid*=\"Jobs\"], header[role=\"banner\"] a[href*=\"jobs\"]"
  ],
  [
    "sidebarLinks.articles",
    "header[role=\"banner\"] [data-testid*=\"Articles\"], header[role=\"banner\"] a[href=\"/compose/articles\"], header[role=\"banner\"] a[href*=\"articles\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.topics",
    "header[role=\"banner\"] a[href*=topics]"
  ],
  [
    "sidebarLinks.circles",
    "header[role=\"banner\"] a[href*=circles]"
  ],
  [
    "sidebarLinks.communities",
    "header[role=\"banner\"] a[href*=communities]"
  ],
  [
    "sidebarLinks.profile",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Profile_Link\"]"
  ],
  [
    "sidebarLinks.lists",
    "header[role=\"banner\"] [data-testid=\"AppTabBar_Lists_Link\"], header[role=\"banner\"] a[href*=\"lists\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.xPremium",
    "header[role=\"banner\"] [data-testid*=\"Premium\"], header[role=\"banner\"] a[href*=\"premium\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.verifiedOrgs",
    "header[role=\"banner\"] [data-testid*=\"Verified\"], header[role=\"banner\"] a[href*=\"verified-orgs\"][role=\"link\"][aria-label], header[role=\"banner\"] a[href*=\"verified-choose\"][role=\"link\"][aria-label]"
  ],
  [
    "sidebarLinks.grok",
    "header[role=\"banner\"] [data-testid*=\"Grok\"], header[role=\"banner\"] a[href*=\"grok\"][role=\"link\"][aria-label]"
  ],
  [
    "accountSwitcherButton",
    "[data-testid=\"SideNav_AccountSwitcher_Button\"]"
  ],
  [
    "leftSidebarLabel",
    "header[role=\"banner\"] nav[role=\"navigation\"] > * > div > div + div:last-child"
  ],
  [
    "accountSwitcherLabel",
    "[data-testid=\"SideNav_AccountSwitcher_Button\"] > div:not(:first-child)"
  ],
  [
    "leftSidebarLabel_hover",
    "header[role=\"banner\"] nav[role=\"navigation\"]:hover > * > div > div + div:last-child"
  ],
  [
    "accountSwitcherLabel_hover",
    "[data-testid=\"SideNav_AccountSwitcher_Button\"]:hover > div:not(:first-child)"
  ],
  [
    "rightSidebar",
    "[data-testid=\"sidebarColumn\"]"
  ],
  [
    "grokDrawer",
    "[data-testid=\"GrokDrawer\"]"
  ],
  [
    "grokDrawerHeader",
    "div[data-testid=\"GrokDrawerHeader\"]"
  ],
  [
    "messagesDrawer",
    "[data-testid=\"chat-drawer-root\"]"
  ],
  [
    "messagesDrawerMain",
    "[data-testid=\"chat-drawer-main\"]"
  ],
  [
    "messagesDrawerLegacy",
    "[data-testid=\"DMDrawer\"]"
  ],
  [
    "timelineTablist",
    "div[data-testid='ScrollSnap-List'][role='tablist']"
  ],
  [
    "timelineTab",
    "[role='tab']"
  ],
  [
    "timelineTabPresentation",
    "div[role='presentation']"
  ],
  [
    "timelineTabSelected",
    "[role='tab'][aria-selected='true']"
  ],
  [
    "timelineTabText",
    "div[dir='ltr'] > span"
  ],
  [
    "timelineOptions",
    "div[aria-label='Timeline options']"
  ],
  [
    "topTweetsOn",
    "div[aria-label='Top Tweets on']"
  ],
  [
    "menuItem",
    "div[role='menuitem'][tabindex='0']"
  ],
  [
    "tweetCounts",
    "[role=\"group\"][id*=\"id__\"]:only-child"
  ],
  [
    "viewCount",
    "[role=\"group\"][id*=\"id__\"]:only-child a[href*='/analytics']"
  ],
  [
    "tweet",
    "[data-testid=\"tweet\"][role=\"article\"]"
  ],
  [
    "tweetSpan",
    "[data-testid=\"tweet\"][role=\"article\"] div > div:only-child > span:only-child > span"
  ],
  [
    "grokSvg",
    "svg:has(path[d=\"M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466\"])"
  ],
  [
    "searchBox",
    "[data-testid=\"sidebarColumn\"] form[role=\"search\"]"
  ],
  [
    "searchBoxInput",
    "[data-testid=\"sidebarColumn\"] form[role=\"search\"] input:only-child"
  ],
  [
    "searchListBox",
    "[data-testid=\"sidebarColumn\"] form[role=\"search\"] div[role=\"listbox\"]"
  ],
  [
    "modalExternalWrapper",
    "div[role=\"group\"]"
  ],
  [
    "modalBackground",
    "div[role=\"group\"] > div:empty"
  ],
  [
    "modalWrapper",
    "div[aria-labelledby=\"modal-header\"][role=\"dialog\"]"
  ],
  [
    "modalUi",
    "div[aria-labelledby=\"modal-header\"][role=\"dialog\"] > div"
  ],
  [
    "tweetButton",
    "[data-testid=\"SideNav_NewTweet_Button\"]"
  ],
  [
    "securityAndAccountAccess",
    "[data-testid=\"accountAccessScreen\"]"
  ]
];
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
