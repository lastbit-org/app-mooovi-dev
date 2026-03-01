import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function LoadingBar() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsComplete(false);

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, 250);

    const hideTimer = setTimeout(() => {
      setIsLoading(false);
      setIsComplete(false);
    }, 450);

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div
      className="loading-bar"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        className={`loading-bar-progress ${isComplete ? "loading-bar-complete" : ""}`}
      />
    </div>
  );
}
