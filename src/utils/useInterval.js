import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    // cf. delay 인자에 null 값을 전달할 경우 타이머를 멈출 수 있음
    if (delay === null) return;

    const timer = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(timer);
  }, [delay]);
};

export default useInterval;
