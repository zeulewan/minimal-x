/**
 * Dynamic features that respond to Twitter's DOM updates:
 * - Navigation buttons
 * - Timeline customizations
 * - View counts
 * Applied via MutationObserver on relevant DOM changes
 */

import {
  KeyFollowingTimeline,
  KeyHideForYouTimeline,
  KeyHideGrokDrawer,
  KeyHideMessagesDrawer,
  KeyHideViewCount,
  KeyNavigationButtonsLabels,
  KeyRemoveTimelineTabs,
  KeyTrendsHomeTimeline,
} from "../../../../storage-keys";
import { applySidebarFeatures, sidebarSettingKeys } from "./sidebar";
import changeHideViewCounts from "../options/hideViewCount";
import { hideGrokDrawer, hideMessagesDrawer, changeNavigationButtonsLabels } from "../options/navigation";
import { changeFollowingTimeline, changeHideForYouTimeline, changeRecentMedia, changeTimelineTabs, changeTrendsHomeTimeline, enableGrokDrawerOnGrokButtonClick } from "../options/timeline";
import hideRightSidebar from "../utilities/hideRightSidebar";
import { updateLeftSidebarPositioning } from "../utilities/leftSidebarPosition";
import { addSmallerSearchBarStyle } from "../utilities/other-styles";
import { getStorage } from "../utilities/storage";
import throttle from "../utilities/throttle";

export const dynamicFeatures = {
  general: async () => {
    const data = await getStorage([KeyHideViewCount, KeyHideGrokDrawer]);

    changeHideViewCounts(data[KeyHideViewCount]);
    changeRecentMedia();
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

export const runDynamicFeatures = throttle(async () => {
  const data = await getStorage([
    KeyFollowingTimeline,
    KeyHideForYouTimeline,
    KeyTrendsHomeTimeline,
    KeyRemoveTimelineTabs,
    KeyHideGrokDrawer,
    KeyHideMessagesDrawer,
    KeyNavigationButtonsLabels,
    ...sidebarSettingKeys,
  ]);

  if (data) {
    dynamicFeatures.general();
    dynamicFeatures.timeline(data);
    dynamicFeatures.navigation(data);
    dynamicFeatures.sidebar(data);

    // The Grok drawer appears dynamically, so we need to handle it here as well
    // as in the static features module
    hideGrokDrawer(data?.[KeyHideGrokDrawer]);
    hideMessagesDrawer(data?.[KeyHideMessagesDrawer]);
  }
}, 50);
