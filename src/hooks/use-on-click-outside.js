import { useEffect } from "react";

export default function(ref, handler) {
  useEffect(() => {
    const listener = (ev) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(ev);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
