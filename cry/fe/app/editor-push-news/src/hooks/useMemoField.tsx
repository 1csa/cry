// TODO: 这里是想搞个不会随其他field变化而重渲染的form

import { useEffect, useMemo, useRef } from 'react';
import { useField } from 'formik';

export const useFieldMeta = (name: string) => {
  const [_, { value }] = useField(name);
  const valueRef = useRef<any>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [name, value])

  return valueRef.current;
}
