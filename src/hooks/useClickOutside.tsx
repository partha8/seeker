import { useEffect, useRef } from "react";

export const useClickOutside = (handler: any) => {
  const domNode = useRef<any>();
  useEffect(() => {
    const clickHandler = (e: any) => {
      if (domNode.current && !domNode.current.contains(e.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  });
  return domNode;
};
