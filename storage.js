import { defaultPreferences } from "./storage-keys";

// Share defaults and error handling between the popup and content scripts.
export const getStorage = (keyOrKeys) => {
  const single = typeof keyOrKeys === "string";
  if (!single && !Array.isArray(keyOrKeys)) {
    return Promise.reject(new TypeError("Expected a setting key or an array of keys"));
  }
  const keys = single ? [keyOrKeys] : keyOrKeys;
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (data) => {
      const error = chrome.runtime.lastError;
      if (error) return reject(new Error(error.message));
      const values = Object.fromEntries(keys.map((key) => [key, data[key] ?? defaultPreferences[key]]));
      resolve(single ? values[keyOrKeys] : values);
    });
  });
};

// A shared trailing throttle drops writes to unrelated settings.
export const setStorage = (values) => new Promise((resolve, reject) => {
  chrome.storage.local.set(values, () => {
    const error = chrome.runtime.lastError;
    if (error) return reject(new Error(error.message));
    resolve(values);
  });
});
