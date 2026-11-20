import { useCallback, useEffect, useState } from "react";

let globalHidden = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

const useDistributionFree = () => {
  const [hidden, setHidden] = useState(globalHidden);

  useEffect(() => {
    const update = () => setHidden(globalHidden);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const toggleHidden = useCallback(() => {
    globalHidden = !globalHidden;
    notify();
  }, []);

  return {
    hidden,
    toggleHidden,
  };
};

export default useDistributionFree;
