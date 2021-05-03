import { useEffect, useRef } from "react";

export default function useLazyLoad(load, deps = []) {
  const intersectionObserverRef = useRef();
  const lastLoadedItemRef = useRef();

  useEffect(
    () => {
      intersectionObserverRef.current?.disconnect?.();
      intersectionObserverRef.current = new IntersectionObserver(([entry]) => {
        entry.isIntersecting && load();
      });
      lastLoadedItemRef.current &&
        intersectionObserverRef.current?.observe?.(lastLoadedItemRef.current);
      return () => intersectionObserverRef.current?.disconnect?.();
    },
    Array.isArray(deps) ? deps : []
  );

  const setRef = (isLast) => (node) => {
    if (isLast) {
      lastLoadedItemRef.current = node;
    }
  };

  return setRef;
}
