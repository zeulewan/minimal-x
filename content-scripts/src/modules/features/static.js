/**
 * Static features are UI modifications that only need to be applied:
 * - Once when the extension loads
 * - When user changes related settings
 * These changes persist until the next settings update.
 */

import {
  KeyCustomCss,
  KeyFollowCount,
  KeyFollowingTimeline,
  KeyHideGrokDrawer,
  KeyHideForYouTimeline,
  KeyHideMessagesDrawer,
  KeyHideViewCount,
  KeyInterFont,
  KeyLikeCount,
  KeyNavigationButtonsLabels,
  KeyNavigationCenter,
  KeyRecentMedia,
  KeyRemovePromotedPosts,
  KeyRemoveTimelineBorders,
  KeyRemoveTimelineTabs,
  KeyRemoveTopicsToFollow,
  KeyRemoveTweetBorders,
  KeyReplyCount,
  KeyRetweetCount,
  KeySearchBar,
  KeySidebarLogo,
  KeyStickyHeader,
  KeyTimelineWidth,
  KeyTitleNotifications,
  KeyTransparentSearch,
  KeyTrendsHomeTimeline,
  KeyTweetButton,
  KeyTweetButtonPosition,
  KeyUnreadCountBadge,
} from "../../../../storage-keys";
import { applySidebarFeatures } from "./sidebar";
import { changeCustomCss } from "../options/customCss";
import { changeFollowingAndFollowersCounts, changeLikeCount, changeReplyCount, changeRetweetCount } from "../options/hideVanityCounts";
import changeHideViewCounts from "../options/hideViewCount";
import { changeHideSearchBar, changeInterFont, changeTitleNotifications, changeTransparentSearchBar, changeTweetButton, changeTweetButtonPosition } from "../options/interface";
import {
  changeNavigationButtonsLabels,
  changeNavigationCenter,
  changeSidebarLogo,
  changeUnreadCountBadge,
  hideGrokDrawer,
  hideMessagesDrawer,
} from "../options/navigation";
import {
  changeFollowingTimeline,
  changeHideForYouTimeline,
  changePromotedPosts,
  changeRecentMedia,
  changeStickyHeader,
  changeTimelineBorders,
  changeTimelineTabs,
  changeTimelineWidth,
  changeTopicsToFollow,
  changeTrendsHomeTimeline,
  changeTweetBorders,
} from "../options/timeline";

export const staticFeatures = {
  timeline: (data) => {
    changeTimelineWidth(data[KeyTimelineWidth]);
    changeTimelineBorders(data[KeyRemoveTimelineBorders]);
    changeTweetBorders(data[KeyRemoveTweetBorders]);
    changeStickyHeader(data[KeyStickyHeader]);
    changeFollowingTimeline(data[KeyFollowingTimeline]);
    changeHideForYouTimeline(data[KeyHideForYouTimeline]);
    changeHideViewCounts(data[KeyHideViewCount]);
    changeRecentMedia(data[KeyRecentMedia]);
    changeTrendsHomeTimeline(data[KeyTrendsHomeTimeline]);
    changePromotedPosts(data[KeyRemovePromotedPosts]);
    changeTopicsToFollow(data[KeyRemoveTopicsToFollow]);
    changeTimelineTabs(data[KeyRemoveTimelineTabs]);
    changeFollowingAndFollowersCounts(data[KeyFollowCount]);
    changeReplyCount(data[KeyReplyCount]);
    changeRetweetCount(data[KeyRetweetCount]);
    changeLikeCount(data[KeyLikeCount]);
  },
  navigation: (data) => {
    changeSidebarLogo(data[KeySidebarLogo]);
    changeNavigationButtonsLabels(data[KeyNavigationButtonsLabels]);
    changeNavigationCenter(data[KeyNavigationCenter]);
    changeUnreadCountBadge(data[KeyUnreadCountBadge]);
    hideGrokDrawer(data[KeyHideGrokDrawer]);
    hideMessagesDrawer(data[KeyHideMessagesDrawer]);
  },
  interface: (data) => {
    changeInterFont(data[KeyInterFont]);
    changeHideSearchBar(data[KeySearchBar]);
    changeTransparentSearchBar(data[KeyTransparentSearch]);
    changeTitleNotifications(data[KeyTitleNotifications]);
    changeTweetButton(data[KeyTweetButton]);
    changeTweetButtonPosition(data[KeyTweetButtonPosition], data[KeyNavigationButtonsLabels]);
  },
  sidebar: (data) => {
    applySidebarFeatures(data);
  },
  advanced: (data) => {
    changeCustomCss(data[KeyCustomCss]);
  },
};

export const applyStaticFeatures = async (data) => {
  Object.values(staticFeatures).forEach((feature) => feature(data));
};
