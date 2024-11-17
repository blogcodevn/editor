import { MouseEvent } from "react";

export interface FABHandler<El = Element, Ev = MouseEvent<El>> {
  (e: Ev): void;
}

export function handleMouse<El = HTMLElement, Ev = MouseEvent<El>>(handler?: FABHandler<El, Ev>) {
  return (e: Ev) => {
    const ev = e as Event;

    "preventDefault" in ev && ev.preventDefault();
    "stopPropagation" in ev && ev.stopPropagation();

    handler?.(e);
  };
}
