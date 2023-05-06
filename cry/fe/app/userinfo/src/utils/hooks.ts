import { useCallback, useRef, useEffect } from 'react';

export const useRefCallback = function(func: CallableFunction, dev: Array<any>) {
  let devRef = useRef(dev);

  useEffect(()=>{
    devRef.current = dev;
  }, [dev]);

  let callbackWithRef = useCallback(()=>{ // 参数问题，如何把func的参数传进去，且把原本dev所对应的参数改换成devRef.current
      func(arguments)
  }, [devRef])

  return callbackWithRef;
}
