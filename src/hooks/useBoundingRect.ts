import { RefObject, useEffect, useState } from "react";

export default function useBoundingRect<T extends HTMLElement>(
  ref: RefObject<T>,
) {
  const [rect, setRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));
  ~useEffect(() => {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
  }, [ref]);

  return rect;
}
