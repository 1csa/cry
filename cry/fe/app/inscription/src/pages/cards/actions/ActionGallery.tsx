import React from 'react';

import { FORM_DOCID } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionGallery {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionGallery: React.FC<ActionGallery> = ({ name, defaultParam }) => {
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

export default React.memo(ActionGallery);
