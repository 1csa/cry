// 这个类型定义搞不定， 哪里都不太对， 因为使用timer，那么表明返回一定会是void=。=
// debounce的最后一次执行会产生指定时间间隔的时延，如果需要去掉时延，考虑使用throttle
import { useCallback, useRef, useEffect } from 'react';

interface Func<P> {
  (...args: P extends Array<any> ? P : any): void;
}

const useDebounce = <PT=any>(func: Func<PT>, interval: number): Func<PT> => {
  const timerRef = useRef<NodeJS.Timeout>(); // 注意MutableRefObject和RefObject

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
      return func.apply(this, args)
    }, interval);
  }, [func, interval, timerRef]);

  return debounceFunc;
}

export default useDebounce;
