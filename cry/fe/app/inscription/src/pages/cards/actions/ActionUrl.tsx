import React from 'react';

import { FORM_URL } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionChannel {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionUrl: React.FC<ActionChannel> = ({ name, defaultParam }) => {
  return (
    <FormItem
      form
      label="URL"
      name={`${name}[${FORM_URL}]`}
      defaultValue={defaultParam ? defaultParam[FORM_URL] : null}
    >
      <YInput />
    </FormItem>
  );
};

export default React.memo(ActionUrl);
