import React from 'react';

import { YesNoOptions, DisplayModeOptions } from '@/config/action.config';
import { FORM_DOCID, FORM_DISPLAYMODE, FORM_ISTRANSIT } from '@/config/action.config';
import { FormItem, YInput, YRadio, YSelect } from '@/components';

interface ActionDoc {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionVideo: React.FC<ActionDoc> = ({ name, defaultParam }) => {
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
        label="详情页打开方式"
        name={`${name}[${FORM_DISPLAYMODE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_DISPLAYMODE] : null}
      >
        <YSelect options={DisplayModeOptions} />
      </FormItem>
      <FormItem
        form
        label="是否承接页"
        name={`${name}[${FORM_ISTRANSIT}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ISTRANSIT] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionVideo);
