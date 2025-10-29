import { LocalStorageHelper } from "../../../../helpers/localStorageHelper";
import type { IntentProps } from "../../intents.model";

export const isVisible = (props: IntentProps): boolean => {
  const visibleIf = props["visible-if"];
  const configuration = LocalStorageHelper.get("intent-configuration") as never;

  return !visibleIf
    ? true
    : Object.entries(visibleIf).every(
        ([key, expected]) => configuration[key] === expected
      );
};
