/**
 * Dynamic features that respond to Twitter's DOM updates:
 * - Navigation buttons
 * - Timeline customizations
 * - View counts
 * Applied via MutationObserver on relevant DOM changes
 */

import {
  allSettingsKeys, KeyExtensionStatus, KeyRecentMedia,
  KeyFollowingTimeline,
  KeyHideForYouTimeline,
  KeyHideGrokDrawer,
  KeyHideMessagesDrawer,
  KeyHideViewCount,
  KeyNavigationButtonsLabels,
  KeyRemoveTimelineTabs,
  KeyTrendsHomeTimeline,
} from "../../../../storage-keys";
import { applySidebarFeatures } from "./sidebar";
import changeHideViewCounts from "../options/hideViewCount";
import { hideGrokDrawer, hideMessagesDrawer, changeNavigationButtonsLabels } from "../options/navigation";
import { changeFollowingTimeline, changeHideForYouTimeline, changeRecentMedia, changeTimelineTabs, changeTrendsHomeTimeline, enableGrokDrawerOnGrokButtonClick } from "../options/timeline";
import hideRightSidebar from "../utilities/hideRightSidebar";
import { updateLeftSidebarPositioning } from "../utilities/leftSidebarPosition";
import { addSmallerSearchBarStyle } from "../utilities/other-styles";
import { getStorage } from "../utilities/storage";
import throttle from "../utilities/throttle";

export const dynamicFeatures = {
  general: async (data) => {

    changeHideViewCounts(data[KeyHideViewCount]);
    await changeRecentMedia(data[KeyRecentMedia]);
    hideRightSidebar();
    addSmallerSearchBarStyle();
    updateLeftSidebarPositioning();
    enableGrokDrawerOnGrokButtonClick(data[KeyHideGrokDrawer]);
  },
  navigation: (data) => {
    changeNavigationButtonsLabels(data[KeyNavigationButtonsLabels]);
  },
  timeline: (data) => {
    changeTimelineTabs(data[KeyRemoveTimelineTabs]);
    changeTrendsHomeTimeline(data[KeyTrendsHomeTimeline]);
    changeFollowingTimeline(data[KeyFollowingTimeline]);
    changeHideForYouTimeline(data[KeyHideForYouTimeline]);
  },
  sidebar: (data) => {
    applySidebarFeatures(data);
  },
};

let running = false;
let pending = false;
export const runDynamicFeatures = throttle(async () => {
  if (running) { pending = true; return; }
  running = true;
  try {
    const data = await getStorage(allSettingsKeys);
    if (data[KeyExtensionStatus] === "off") return;
    await dynamicFeatures.general(data);
    dynamicFeatures.timeline(data);
    dynamicFeatures.navigation(data);
    dynamicFeatures.sidebar(data);
    hideGrokDrawer(data[KeyHideGrokDrawer]);
    hideMessagesDrawer(data[KeyHideMessagesDrawer]);
  } catch (error) {
    console.error("Unable to update Minimal X features", error);
  } finally {
    running = false;
    if (pending) { pending = false; runDynamicFeatures(); }
  }
}, 50);
