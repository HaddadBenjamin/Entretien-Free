import { useEffect, useState } from "react";
import { fetchIntents } from "../intents.mock";
import type {
  IntentsData,
  screenIdType,
  UseIntentsResult,
} from "../intents.model";

function useIntents(screenId: string | undefined): UseIntentsResult {
  const [intents, setIntents] = useState<IntentsData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!screenId) {
      setLoading(false);
      return;
    }

    const loadIntents = async () => {
      if (!screenId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchIntents(screenId as screenIdType);
        setIntents((data as IntentsData) || {});
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erreur inconnue"));
        setIntents({});
      } finally {
        setLoading(false);
      }
    };

    loadIntents();
  }, [screenId]);

  return { intents, loading, error };
}

export default useIntents;
