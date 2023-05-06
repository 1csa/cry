import React from 'react';

import { FORM_APPID, FORM_SCHEME } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionScheme {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionScheme: React.FC<ActionScheme> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="Scheme"
        name={`${name}[${FORM_SCHEME}]`}
        defaultValue={defaultParam ? defaultParam[FORM_SCHEME] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="AppID"
        name={`${name}[${FORM_APPID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_APPID] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionScheme);
