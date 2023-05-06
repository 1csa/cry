import React from 'react';

import { YInput, YRadio, FormItem } from '@/components';
import { YesNoOptions, FORM_DOCID, FORM_ISTRANSIT, FORM_NEWTRANSIT } from '@/config/action.config';

interface ActionDoc {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionDoc: React.FC<ActionDoc> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="Docid"
        name={`${name}[${FORM_DOCID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_DOCID] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="是否承接页"
        name={`${name}[${FORM_ISTRANSIT}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ISTRANSIT] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem
        form
        label="是否新承接"
        name={`${name}[${FORM_NEWTRANSIT}]`}
        defaultValue={defaultParam ? defaultParam[FORM_NEWTRANSIT] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionDoc);
