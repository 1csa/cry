import React from 'react';
declare interface KeyPair<T, U> {
  key: T;
  value: U;
  render?: (text: T, record: any, index: number) => React.ReactNode
}
