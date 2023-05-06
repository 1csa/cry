import React from 'react';

import { YesNoOptions, FORM_DOCID, FORM_SETTODEFAULTCATA } from '@/config/action.config';
import { FormItem, YInput, YRadio } from '@/components';

interface ActionComic {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionComic: React.FC<ActionComic> = ({ name, defaultParam }) => {
  console.log(`${name}[${FORM_DOCID}]}`, 'name')
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
        label="默认定位到目录"
        name={`${name}[${FORM_SETTODEFAULTCATA}]`}
        defaultValue={defaultParam ? defaultParam[FORM_SETTODEFAULTCATA] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionComic);
