import type { COMPONENT_MAP, INTENTS } from "./intents.const";

export type IntentName = keyof typeof COMPONENT_MAP;
export type IntentComponent = (typeof COMPONENT_MAP)[IntentName];

export type IntentProps = {
  "visible-if"?: Record<string, boolean>;
  [key: string]: unknown;
};

export type IntentsData = Record<string, IntentProps>;

export interface UseIntentsResult {
  intents: IntentsData;
  loading: boolean;
  error: Error | null;
}

export type screenIdType = keyof typeof INTENTS;
