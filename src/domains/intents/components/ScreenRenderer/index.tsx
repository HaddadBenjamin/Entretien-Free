import { useParams } from "react-router";
import useIntents from "../../hooks/useIntents.ts";
import { isVisible } from "./index.utils.tsx";
import type { IntentProps, IntentName } from "../../intents.model.tsx";
import { COMPONENT_MAP } from "../../intents.const.tsx";
import useSharedLocalStorage from "../../../../hooks/useSharedLocalStorage.ts";

export default function ScreenRenderer() {
  const { screenId } = useParams<{ screenId: string }>();
  const { intents, loading, error } = useIntents(screenId);
  
  // Met à jour l'affichage du composant lorsque
  useSharedLocalStorage("intent-configuration");

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Erreur : {error.message}</div>;
  }

  return (
    <div className="p-4">
      <p className="text-xl font-bold mb-4">Écran dynamique : {screenId}</p>

      <div className="space-y-4">
        {Object.entries(intents).map(
          ([intentName, props]: [string, IntentProps]) => {
            const Component = COMPONENT_MAP[intentName as IntentName];

            if (!Component) return null;
            if (!isVisible(props)) return null;

            const cleanProps = { ...props };
            delete cleanProps["visible-if"];

            return (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <Component key={intentName} {...(cleanProps as any)} />
            );
          }
        )}
      </div>
    </div>
  );
}
