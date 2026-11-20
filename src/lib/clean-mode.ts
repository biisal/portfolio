import { useSyncExternalStore } from "react";

/**
 * Clean mode: a reading layout with no stickman, no motion and no visual
 * extras, just the content. The flag lives as `data-clean` on <html> so CSS
 * can restyle everything, and in localStorage so it survives reloads.
 */
const CLEAN_KEY = "clean-mode";
const EVENT = "clean-mode-change";

const read = () =>
  typeof document !== "undefined" &&
  document.documentElement.hasAttribute("data-clean");

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
};

export function setCleanMode(on: boolean) {
  const root = document.documentElement;
  if (on) root.dataset.clean = "";
  else delete root.dataset.clean;
  try {
    localStorage.setItem(CLEAN_KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** True while clean mode is on. Always false during server rendering. */
export function useCleanMode() {
  return useSyncExternalStore(subscribe, read, () => false);
}
