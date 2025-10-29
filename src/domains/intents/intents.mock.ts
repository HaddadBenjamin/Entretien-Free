import { INTENTS } from "./intents.const";
import type { IntentProps, screenIdType } from "./intents.model";

export function fetchIntents(
  screenId: screenIdType
): Promise<Record<string, IntentProps>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(INTENTS[screenId]), 50 + Math.random() * 950);
  });
}
