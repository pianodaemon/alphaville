import { useRef, useEffect } from "react";

/**
 * `useUnload` subscribes to the `window.onbeforeunload` event and calls the function passed in
 * when the event is triggered.
 *
 * Usage:
 *
 * ```ts
 * useUnload((e: any) => {
 *   e.preventDefault();
 *   const confirmMsg = '';
 *   e.returnValue = confirmMsg;
 *   return confirmMsg;
 * });
 * ```
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
export const useUnload: (fn: Function) => void = (fn: Function) => {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    const onUnload = (e: any) => cb.current(e);
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  });
};
