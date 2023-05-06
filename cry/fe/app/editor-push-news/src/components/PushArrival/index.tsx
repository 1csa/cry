import React from 'react';

import * as PushArrivalForms from './forms';

interface PushArrival {
  config?: string[];
}

export const PushArrival: React.FC<PushArrival> = React.memo(({ config }) => {
  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };
  return config ? (
    <>
      {config.map(item => {
        const name = genFormName(item);
        return name ? React.createElement(PushArrivalForms[name], { key: item }) : null;
      })}
    </>
  ) : null;
});
