import React from 'react';

import { FORM_TALKID } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionTalk {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionTalk: React.FC<ActionTalk> = ({ name, defaultParam }) => {
  return (
    <FormItem
      form
      label="URL"
      name={`${name}[${FORM_TALKID}]`}
      defaultValue={defaultParam ? defaultParam[FORM_TALKID] : null}
    >
      <YInput />
    </FormItem>
  );
};

export default React.memo(ActionTalk);
