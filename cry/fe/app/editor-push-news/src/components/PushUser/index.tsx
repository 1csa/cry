import React from 'react';

import * as PushUserForms from './forms';
import "./index.less";

interface PushUser {
  config?: string[];
}

export const PushUser: React.FC<PushUser> = ({ config }) => {
  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };
  // console.log(config)

  return config ? (
    <>
      {config.map(item => {
        const name = genFormName(item);
        return name ? React.createElement(PushUserForms[name], {key: item}) : null;
      })}
    </>
  ) : null;
};
