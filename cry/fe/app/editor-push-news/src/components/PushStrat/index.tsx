import React from 'react';
import * as StratForms from './forms';

interface PushStrat {
  config?: string[];
}

export const PushStrat: React.FC<PushStrat> = ({ config = [] }) => {
  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };

  return config?.length ? (
    <>
      {config.map(item => {
        const name = genFormName(item);
        return name ? React.createElement(StratForms[name], { key: name }) : null;
      })}
    </>
  ) : null;
};
