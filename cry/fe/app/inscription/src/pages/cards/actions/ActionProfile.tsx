import React from 'react';

import { FORM_PROFILEID, FORM_TAB, DefaultTabOptions } from '@/config/action.config';
import { FormItem, YInput, YSelect } from '@/components';

interface ActionProfile {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionProfile: React.FC<ActionProfile> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="profile_id"
        name={`${name}[${FORM_PROFILEID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_PROFILEID] : null}
      >
        <YInput />
      </FormItem>
      <FormItem form label="默认跳转tab" name={`${name}[${FORM_TAB}]`}>
        <YSelect options={DefaultTabOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionProfile);
