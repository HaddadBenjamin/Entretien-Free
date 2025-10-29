import { useState } from "react";
import { LocalStorageHelper } from "../helpers/localStorageHelper";

export default function AcceptCGU({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex gap-2 items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          const checked = e.target.checked;

          setChecked(checked);
          LocalStorageHelper.set("intent-configuration", {
            ...LocalStorageHelper.get<object>("intent-configuration"),
            "accept-cgu": checked,
          });
        }}
      />
      {label}
    </label>
  );
}
