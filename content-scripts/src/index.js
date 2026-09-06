import { allSettingsKeys, KeyExtensionStatus } from "../../storage-keys";
import { applyStaticFeatures } from "./modules/features/static";
import { initializeExtension } from "./modules/initialize";
import { runDynamicFeatures } from "./modules/features/dynamic";
import { getStorage } from "./modules/utilities/storage";

/**
 * Extension Lifecycle:
 * 1. Extension Load:
 *    - Initialize observers, listeners, styles
 *    - Apply static features
 *    - Start dynamic feature monitoring
 *
 * 2. Settings Changes:
 *    - Reapply affected static features
 *    - Dynamic features auto-update on DOM changes
 */

// Listen to settings changes
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local") return;
  if (changes[KeyExtensionStatus]?.newValue !== changes[KeyExtensionStatus]?.oldValue) {
    window.location.reload();
    return;
  }

  const status = await getStorage(KeyExtensionStatus);
  if (status === "off") return;

  // Features with linked settings (such as button position and navigation labels)
  // need a complete snapshot. Run DOM features even if styles were unchanged.
  const data = await getStorage(allSettingsKeys);
  applyStaticFeatures(data);
  runDynamicFeatures();
});

// Initialize extension
const init = async () => {
  const status = await getStorage(KeyExtensionStatus);
  if (status === "off") return;

  await initializeExtension();
};

init();
