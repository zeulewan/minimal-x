import { useCallback, useEffect, useRef, useState } from "react";
import { defaultPreferences } from "../../storage-keys";
import { getStorage, setStorage } from "./chromeStorage";

export function useStorageState(storageKey) {
  const [value, setValue] = useState(defaultPreferences[storageKey]);
  const [loaded, setLoaded] = useState(false);
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    const initialRevision = revision.current;
    const changed = (changes, area) => {
      if (area !== "local" || !(storageKey in changes)) return;
      revision.current++;
      setValue(changes[storageKey].newValue ?? defaultPreferences[storageKey]);
    };
    chrome.storage.onChanged.addListener(changed);
    getStorage(storageKey).then((saved) => {
      if (active && revision.current === initialRevision) setValue(saved);
    }).catch(console.warn).finally(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
      chrome.storage.onChanged.removeListener(changed);
    };
  }, [storageKey]);

  const update = useCallback((nextValue) => {
    revision.current++;
    setValue(nextValue);
    return setStorage({ [storageKey]: nextValue }).catch(console.warn);
  }, [storageKey]);

  return [value, update, loaded];
}

export default function useStorageKeyState(storageKey) {
  const [value, update, loaded] = useStorageState(storageKey);
  const setChecked = useCallback((checked) => update(checked ? "on" : "off"), [update]);
  return [value === "on", setChecked, loaded];
}

export function useStorageValue(storageKey) {
  return useStorageState(storageKey)[0];
}
