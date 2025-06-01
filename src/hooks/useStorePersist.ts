import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";

export const useStorePersist = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useAuth.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuth.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  return {
    isHydrated,
  };
};
