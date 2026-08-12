import { useSyncExternalStore } from "react";

export type GemSettings = {
  defaultPlatform: string;
  autoMergeContacts: boolean;
  showSpatialView: boolean;
  showHotWatch: boolean;
  showRelationshipRatio: boolean;
  showLateNightAlerts: boolean;
  copyOnSend: boolean;
  deepLinkFallback: boolean;
  compactInboxCards: boolean;
};

const DEFAULTS: GemSettings = {
  defaultPlatform: "sms",
  autoMergeContacts: true,
  showSpatialView: true,
  showHotWatch: true,
  showRelationshipRatio: true,
  showLateNightAlerts: true,
  copyOnSend: true,
  deepLinkFallback: true,
  compactInboxCards: false,
};

const KEY = "gem-settings";

function load(): GemSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

let state: GemSettings = load();
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const settingsStore = {
  get(): GemSettings {
    return state;
  },
  set(partial: Partial<GemSettings>) {
    state = { ...state, ...partial };
    persist();
  },
  reset() {
    state = { ...DEFAULTS };
    persist();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useSettings(): [GemSettings, (partial: Partial<GemSettings>) => void] {
  const s = useSyncExternalStore(settingsStore.subscribe, settingsStore.get);
  return [s, settingsStore.set];
}
