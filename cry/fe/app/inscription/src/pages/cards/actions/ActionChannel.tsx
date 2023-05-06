import React from 'react';

import { FORM_FROMID } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionChannel {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionChannel: React.FC<ActionChannel> = ({ name, defaultParam }) => {
  return (
    <FormItem
      form
      label="FromId"
      name={`${name}[${FORM_FROMID}]`}
      defaultValue={defaultParam ? defaultParam[FORM_FROMID] : null}
    >
      <YInput />
    </FormItem>
  );
};

export default React.memo(ActionChannel);
