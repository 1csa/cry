import { useCallback, useRef, useEffect } from 'react';

const useDebounce = <PT>(func: (...args: any[]) => void, interval) => {
  const timerRef = useRef<NodeJS.Timeout>(); // 很神奇的有MutableRefObject 和 RefObject

  // 在组件被卸载的时候去掉
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerRef]);

  const debounceFunc = useCallback((...args: PT extends Array<any> ?  PT : any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      func.apply(this, args)
    }, interval);
  }, [func, interval, timerRef]);

  return debounceFunc;
}

export default useDebounce;
