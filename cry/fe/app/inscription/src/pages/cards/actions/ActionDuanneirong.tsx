import React from 'react';

import { FORM_DOCID } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionDuanneirong {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionDuanneirong: React.FC<ActionDuanneirong> = ({ name, defaultParam }) => {
  return (
    <FormItem
      form
      label="Docid"
      name={`${name}[${FORM_DOCID}]`}
      defaultValue={defaultParam ? defaultParam[FORM_DOCID] : null}
    >
      <YInput />
    </FormItem>
  );
};

export default React.memo(ActionDuanneirong);
