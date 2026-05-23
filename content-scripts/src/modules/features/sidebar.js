import {
  KeyArticlesButton,
  KeyBookmarksButton,
  KeyCommunitiesButton,
  KeyCreatorStudioButton,
  KeyExploreButton,
  KeyFollowingButton,
  KeyGrokButton,
  KeyHomeButton,
  KeyJobsButton,
  KeyListsButton,
  KeyMessagesButton,
  KeyMoreButton,
  KeyNotificationsButton,
  KeyProfileButton,
  KeyTopicsButton,
  KeyVerifiedOrgsButton,
  KeyXPremiumButton,
} from "../../../../storage-keys";
import {
  changeArticlesButton,
  changeBookmarksButton,
  changeCommunitiesButton,
  changeCreatorStudioButton,
  changeExploreButton,
  changeFollowingButton,
  changeGrokButton,
  changeHomeButton,
  changeJobsButton,
  changeListsButton,
  changeMessagesButton,
  changeMoreButton,
  changeNotificationsButton,
  changeProfileButton,
  changeTopicsButton,
  changeVerifiedOrgsButton,
  changeXPremiumButton,
} from "../options/navigation";

export const sidebarSettingKeys = [
  KeyHomeButton,
  KeyExploreButton,
  KeyNotificationsButton,
  KeyMessagesButton,
  KeyFollowingButton,
  KeyBookmarksButton,
  KeyMoreButton,
  KeyCreatorStudioButton,
  KeyJobsButton,
  KeyArticlesButton,
  KeyCommunitiesButton,
  KeyTopicsButton,
  KeyListsButton,
  KeyProfileButton,
  KeyXPremiumButton,
  KeyGrokButton,
  KeyVerifiedOrgsButton,
];

export const applySidebarFeatures = (data) => {
  changeHomeButton(data[KeyHomeButton]);
  changeExploreButton(data[KeyExploreButton]);
  changeNotificationsButton(data[KeyNotificationsButton]);
  changeMessagesButton(data[KeyMessagesButton]);
  changeFollowingButton(data[KeyFollowingButton]);
  changeBookmarksButton(data[KeyBookmarksButton]);
  changeMoreButton(data[KeyMoreButton]);
  changeCreatorStudioButton(data[KeyCreatorStudioButton]);
  changeJobsButton(data[KeyJobsButton]);
  changeArticlesButton(data[KeyArticlesButton]);
  changeCommunitiesButton(data[KeyCommunitiesButton]);
  changeTopicsButton(data[KeyTopicsButton]);
  changeListsButton(data[KeyListsButton]);
  changeProfileButton(data[KeyProfileButton]);
  changeXPremiumButton(data[KeyXPremiumButton]);
  changeGrokButton(data[KeyGrokButton]);
  changeVerifiedOrgsButton(data[KeyVerifiedOrgsButton]);
};
