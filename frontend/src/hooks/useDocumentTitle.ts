import { useEffect } from "react";

const APP_NAME = "Mooovi";

/**
 * Sets document.title to "<title> | Mooovi" while the component is mounted.
 * Restores the default title on unmount.
 * Pass undefined while data is still loading to keep the default title.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
