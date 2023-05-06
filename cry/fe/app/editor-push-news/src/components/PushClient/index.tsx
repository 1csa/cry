import React from 'react';

import * as PushClientForms from './forms';

interface PushClient {
  config?: string[];
}

export const PushClient: React.FC<PushClient> = React.memo(({ config }) => {
  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };

  return config ? (
    <>
      {config.map(item => {
        const name = genFormName(item);
        return name ? React.createElement(PushClientForms[name], { key: item }) : null;
      })}
    </>
  ) : null;
});
